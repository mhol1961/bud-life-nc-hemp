Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { firstName, lastName, birthDate, address, city, state, zipCode, verificationLevel } = await req.json();

        console.log('Real age verification request:', { firstName, lastName, birthDate, city, state, verificationLevel });

        if (!firstName || !lastName || !birthDate || !address || !city || !state || !zipCode) {
            throw new Error('All personal information fields are required for age verification');
        }

        // Get environment variables
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Calculate age for initial check
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        const basicAgeCheck = age >= 21;
        const sessionId = crypto.randomUUID();

        // If basic age check fails, no need for API verification
        if (!basicAgeCheck) {
            await logVerificationSession({
                supabaseUrl,
                serviceRoleKey,
                sessionId,
                firstName,
                lastName,
                birthDate,
                address,
                city,
                state,
                zipCode,
                age,
                verificationLevel: verificationLevel || 'basic',
                status: 'age_failed',
                method: 'basic_calculation',
                score: 0,
                failureReason: 'Age under 21',
                req
            });

            return new Response(JSON.stringify({
                data: {
                    verified: false,
                    age: age,
                    sessionId: sessionId,
                    verificationLevel: 'basic',
                    message: 'You must be 21 or older to access this site',
                    timestamp: new Date().toISOString()
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        let verified = basicAgeCheck;
        let verificationMethod = 'basic_calculation';
        let verificationScore = basicAgeCheck ? 70 : 0;
        let apiResponse = null;

        // For checkout-level verification, use ageverifier.net API
        if (verificationLevel === 'checkout' && basicAgeCheck) {
            try {
                console.log('Performing real age verification via ageverifier.net API');
                
                // Real ageverifier.net API integration
                // API Documentation: https://ageverifier.net/api-docs
                const verificationData = {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    dateOfBirth: birthDate,
                    address: {
                        street: address.trim(),
                        city: city.trim(),
                        state: state.toUpperCase(),
                        zipCode: zipCode.trim()
                    },
                    verificationLevel: 'enhanced' // Use enhanced verification for compliance
                };

                const apiResponse = await fetch('https://api.ageverifier.net/v1/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Deno.env.get('AGEVERIFIER_API_KEY')}`,
                        'User-Agent': 'BudLifeNC-Admin/1.0'
                    },
                    body: JSON.stringify(verificationData)
                });

                if (!apiResponse.ok) {
                    const errorText = await apiResponse.text();
                    console.error('ageverifier.net API error:', errorText);
                    
                    // Fall back to enhanced local verification if API fails
                    console.log('Falling back to enhanced local verification');
                    const fallbackResult = await performEnhancedLocalVerification({
                        firstName,
                        lastName,
                        birthDate,
                        address,
                        city,
                        state,
                        zipCode,
                        age
                    });
                    
                    verified = fallbackResult.verified;
                    verificationMethod = 'enhanced_local_fallback';
                    verificationScore = fallbackResult.score;
                } else {
                    const apiResult = await apiResponse.json();
                    console.log('ageverifier.net API response:', apiResult);
                    
                    // Process real API response
                    verified = apiResult.verified === true && apiResult.ageVerified === true;
                    verificationMethod = 'ageverifier_api';
                    verificationScore = apiResult.confidenceScore || (verified ? 95 : 30);
                    apiResponse = {
                        verified: apiResult.verified,
                        ageVerified: apiResult.ageVerified,
                        confidenceScore: apiResult.confidenceScore,
                        verificationId: apiResult.verificationId,
                        riskLevel: apiResult.riskLevel,
                        responseTime: apiResult.responseTime
                    };
                }
            } catch (apiError) {
                console.error('Age verification API error:', apiError);
                
                // Fall back to enhanced local verification
                console.log('API unavailable, using enhanced local verification');
                const fallbackResult = await performEnhancedLocalVerification({
                    firstName,
                    lastName,
                    birthDate,
                    address,
                    city,
                    state,
                    zipCode,
                    age
                });
                
                verified = fallbackResult.verified;
                verificationMethod = 'enhanced_local_fallback';
                verificationScore = fallbackResult.score;
            }
        }

        // Log verification session
        await logVerificationSession({
            supabaseUrl,
            serviceRoleKey,
            sessionId,
            firstName,
            lastName,
            birthDate,
            address,
            city,
            state,
            zipCode,
            age,
            verificationLevel: verificationLevel || 'basic',
            status: verified ? 'verified' : 'rejected',
            method: verificationMethod,
            score: Math.round(verificationScore),
            failureReason: verified ? null : (basicAgeCheck ? 'Enhanced verification failed' : 'Age under 21'),
            apiResponse,
            req
        });

        const result = {
            data: {
                verified,
                age,
                sessionId,
                verificationLevel: verificationLevel || 'basic',
                verificationMethod,
                verificationScore: Math.round(verificationScore * 100) / 100,
                message: verified 
                    ? 'Age verification successful' 
                    : (basicAgeCheck 
                        ? 'Enhanced verification requirements not met' 
                        : 'You must be 21 or older to access this site'),
                apiUsed: verificationMethod === 'ageverifier_api',
                timestamp: new Date().toISOString()
            }
        };

        console.log('Age verification completed:', {
            verified,
            method: verificationMethod,
            score: verificationScore.toFixed(2)
        });

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Age verification error:', error);

        const errorResponse = {
            error: {
                code: 'AGE_VERIFICATION_FAILED',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

// Helper function to perform enhanced local verification when API is unavailable
async function performEnhancedLocalVerification(data) {
    const { firstName, lastName, birthDate, address, city, state, zipCode, age } = data;
    
    let score = 0.5; // Base score
    let verified = age >= 21;
    
    // Name validation (proper format, reasonable length)
    if (firstName.length >= 2 && lastName.length >= 2 && 
        /^[a-zA-Z\s-'.]+$/.test(firstName + lastName)) {
        score += 0.15;
    }
    
    // Address completeness and format
    if (address.length >= 5 && city.length >= 2 && zipCode.length >= 5) {
        score += 0.15;
    }
    
    // ZIP code format validation
    if (/^\d{5}(-\d{4})?$/.test(zipCode)) {
        score += 0.1;
    }
    
    // State validation
    const validStates = ['NC', 'SC', 'VA', 'TN', 'GA', 'FL', 'NY', 'CA', 'TX'];
    if (validStates.includes(state.toUpperCase())) {
        score += 0.1;
    }
    
    // Date validation
    const date = new Date(birthDate);
    if (!isNaN(date.getTime()) && date < new Date() && date > new Date('1900-01-01')) {
        score += 0.1;
    }
    
    // Final verification decision
    verified = verified && score > 0.65;
    
    return {
        verified,
        score: score * 100 // Convert to percentage
    };
}

// Helper function to log verification sessions
async function logVerificationSession(params) {
    const {
        supabaseUrl, serviceRoleKey, sessionId, firstName, lastName, birthDate,
        address, city, state, zipCode, age, verificationLevel, status, method,
        score, failureReason, apiResponse, req
    } = params;
    
    try {
        const logData = {
            first_name: firstName,
            last_name: lastName,
            date_of_birth: birthDate,
            calculated_age: age,
            verification_status: status,
            verification_method: method,
            confidence_score: score,
            verification_id: sessionId,
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown',
            verification_data: {
                address,
                city,
                state,
                zip_code: zipCode,
                verification_level: verificationLevel,
                api_response: apiResponse
            },
            failure_reason: failureReason
        };

        const logResponse = await fetch(`${supabaseUrl}/rest/v1/enhanced_age_verification_logs`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(logData)
        });

        if (!logResponse.ok) {
            const errorText = await logResponse.text();
            console.error('Failed to log verification session:', errorText);
        }
    } catch (error) {
        console.error('Verification logging error:', error);
    }
}