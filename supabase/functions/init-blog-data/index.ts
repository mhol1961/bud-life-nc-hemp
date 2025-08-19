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
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Create blog categories
        const categoriesResponse = await fetch(`${supabaseUrl}/rest/v1/blog_categories`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify([
                {
                    id: '550e8400-e29b-41d4-a716-446655440000',
                    name: 'Hemp Education',
                    slug: 'hemp-education',
                    description: 'Educational content about hemp and THCA',
                    icon: 'book',
                    color: '#22C55E'
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440001', 
                    name: 'Cultivation & Growing',
                    slug: 'cultivation',
                    description: 'Professional hemp cultivation techniques',
                    icon: 'plant',
                    color: '#10B981'
                }
            ])
        });

        // Create the blog post
        const postResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
                id: '660e8400-e29b-41d4-a716-446655440000',
                title: 'From Seed to Sale: Our Cultivation Journey',
                slug: 'from-seed-to-sale-our-cultivation-journey',
                excerpt: 'Follow the complete journey of our hemp plants from germination to harvest in our state-of-the-art indoor facility.',
                content: `# From Seed to Sale: Our Cultivation Journey\n\nWelcome to an inside look at our comprehensive hemp cultivation process. At Bud Life NC, we believe in transparency and quality at every step of our journey from seed to your doorstep.\n\n## Starting with Premium Genetics\n\nOur cultivation journey begins with carefully selected hemp genetics that meet all federal compliance standards. We source our seeds from reputable suppliers who provide detailed lineage and cannabinoid profiles, ensuring we start with the highest quality foundation.\n\n### Seed Selection Criteria\n- **Genetic Stability**: We choose varieties with proven stable genetics and consistent cannabinoid production\n- **Compliance Assurance**: All genetics are pre-tested to ensure they stay within federal THC limits\n- **Terpene Profiles**: We select for rich terpene expressions that enhance the overall experience\n- **Regional Adaptation**: Our genetics are specifically chosen to thrive in North Carolina\'s climate\n\n## Indoor Growing Excellence\n\nOur state-of-the-art indoor facility provides complete environmental control, allowing us to maximize quality while ensuring year-round consistency. This controlled environment approach offers numerous advantages over traditional outdoor cultivation.\n\n### Environmental Control Systems\n\n**Climate Management**\nOur facility maintains precise temperature and humidity levels throughout the growing cycle. This control prevents stress on the plants and reduces the risk of mold, mildew, or pest infestations.\n\n**Advanced Lighting Technology**\nWe utilize full-spectrum LED lighting systems that provide optimal photosynthetic efficiency while minimizing energy consumption. Our lighting schedule is carefully programmed to maximize cannabinoid and terpene production.\n\n**Air Circulation and Filtration**\nMultiple air exchange systems ensure proper ventilation while advanced filtration removes contaminants and controls odors, creating the ideal growing environment.\n\n## The Growing Process\n\n### Germination Phase (Days 1-7)\nSeeds are germinated in controlled conditions with optimal moisture and temperature. We monitor each seed for successful sprouting and healthy root development.\n\n### Vegetative Growth (Weeks 2-8)\nDuring the vegetative phase, plants develop their structure and foliage. We provide:\n- Balanced nutrient programs tailored to growth stage needs\n- Optimal lighting schedules to promote healthy development\n- Regular monitoring and adjustment of environmental conditions\n- Pruning and training techniques to maximize yield potential\n\n### Flowering Phase (Weeks 9-16)\nThe flowering phase is when cannabinoids and terpenes develop. This critical period requires:\n- Adjusted lighting schedules to trigger and maintain flowering\n- Modified nutrition programs to support flower development\n- Increased monitoring for quality control\n- Environmental fine-tuning to optimize cannabinoid production\n\n## Quality Assurance Throughout Growth\n\n### Daily Monitoring\nOur cultivation team performs daily inspections of every plant, checking for:\n- Plant health indicators\n- Environmental condition stability\n- Nutrient deficiencies or excesses\n- Early detection of any issues\n\n### Weekly Testing\nWe conduct regular testing throughout the growing cycle to monitor:\n- Cannabinoid development progression\n- Plant health markers\n- Environmental data logging\n- Growth rate tracking\n\n### Integrated Pest Management\nOur IPM program focuses on prevention and uses beneficial organisms and organic treatments when intervention is needed, ensuring our final product is clean and safe.\n\n## Harvest Timing and Techniques\n\n### Optimal Harvest Windows\nDetermining the perfect harvest time requires expertise and careful observation. Our master cultivators evaluate:\n- Trichome development and maturity\n- Cannabinoid peak levels\n- Terpene profile optimization\n- Overall plant readiness indicators\n\n### Careful Harvesting Process\nOur harvest process preserves quality through:\n- Hand-harvesting techniques that protect delicate trichomes\n- Immediate environmental control post-harvest\n- Careful handling to prevent damage\n- Quick transition to the drying process\n\n## Post-Harvest Processing\n\n### Drying Process\nProper drying is crucial for maintaining cannabinoid potency and preventing degradation:\n- Controlled temperature and humidity environment\n- Optimal airflow to prevent mold while preserving quality\n- Gradual moisture reduction over 7-10 days\n- Regular monitoring to ensure proper progression\n\n### Curing Excellence\nOur curing process enhances flavor, aroma, and overall quality:\n- Glass jar curing in controlled environments\n- Regular burping schedules to manage moisture\n- Extended curing periods for optimal development\n- Continuous quality monitoring throughout the process\n\n## Testing and Compliance\n\n### Comprehensive Laboratory Testing\nEvery batch undergoes extensive testing for:\n\n**Potency Analysis**\n- Complete cannabinoid profiles including THCA, CBD, and minor cannabinoids\n- Verification of federal compliance standards\n- Consistency verification across batches\n\n**Safety Testing**\n- Pesticide residue screening\n- Heavy metal analysis\n- Microbial contamination testing\n- Residual solvent analysis\n\n**Terpene Profiling**\n- Complete terpene identification and quantification\n- Flavor and aroma profile documentation\n- Effects profile correlation\n\n### Certificate of Analysis (COA)\nEvery product includes a detailed COA providing:\n- Complete test results from accredited laboratories\n- Batch-specific information and traceability\n- Testing dates and methodologies\n- Compliance verification documentation\n\n## Packaging and Storage\n\n### Proper Storage Protocols\nOur storage facilities maintain optimal conditions to preserve quality:\n- Climate-controlled environments\n- Protection from light and air exposure\n- Humidity control to prevent degradation\n- Organized inventory management systems\n\n### Packaging Standards\nOur packaging protects product integrity while providing important information:\n- Airtight, lightproof containers\n- Clear labeling with all required information\n- Batch tracking for complete traceability\n- Child-resistant packaging as required\n\n## Quality Control Measures\n\n### Batch Testing\nEvery production batch undergoes multiple quality control checkpoints:\n- Pre-harvest sampling and testing\n- Post-harvest quality verification\n- Final product testing before release\n- Ongoing stability testing\n\n### Staff Training and Expertise\nOur cultivation team receives continuous training in:\n- Latest cultivation techniques and technologies\n- Quality control procedures and standards\n- Compliance requirements and updates\n- Safety protocols and best practices\n\n## From Our Facility to You\n\n### Order Processing\nWhen you place an order, our system ensures:\n- Fresh product selection from recent batches\n- Proper packaging for shipping\n- Complete documentation and compliance materials\n- Careful handling throughout the fulfillment process\n\n### Shipping and Delivery\nWe partner with reliable carriers to ensure:\n- Discreet packaging that protects privacy\n- Proper handling during transit\n- Tracking information for peace of mind\n- Compliance with all shipping regulations\n\n## Our Commitment to Excellence\n\nAt Bud Life NC, our cultivation journey represents our commitment to providing the highest quality hemp products while maintaining full compliance with all regulations. Every step of our process is designed to ensure that when you receive our products, you\'re getting the result of careful attention to detail, scientific precision, and genuine care for quality.\n\n### Continuous Improvement\nWe constantly evaluate and improve our processes through:\n- Regular facility upgrades and technology improvements\n- Staff education and training programs\n- Customer feedback integration\n- Industry best practice adoption\n\n### Sustainability Focus\nOur cultivation practices emphasize environmental responsibility:\n- Energy-efficient lighting and climate systems\n- Water conservation and recycling programs\n- Organic waste composting and reuse\n- Minimal packaging waste initiatives\n\n## Conclusion\n\nOur seed-to-sale journey represents more than just cultivation – it\'s a commitment to transparency, quality, and customer satisfaction. By controlling every aspect of the process, from genetics selection through final delivery, we ensure that every product meets our high standards and your expectations.\n\nWhen you choose Bud Life NC, you\'re not just purchasing hemp products – you\'re supporting a local business that takes pride in craftsmanship, follows all regulations, and puts quality first in everything we do.\n\nWe invite you to experience the difference that careful cultivation and attention to detail can make. Thank you for being part of our journey from seed to sale.`,
                author: 'Bud Life NC Cultivation Team',
                category_id: '550e8400-e29b-41d4-a716-446655440001',
                featured_image_url: '/images/blog/hemp-blog-thumbnail.jpg',
                published_at: '2025-01-15T10:00:00Z',
                read_time: 8,
                view_count: 1103,
                is_featured: true,
                is_published: true,
                seo_title: 'From Seed to Sale: Our Hemp Cultivation Journey | Bud Life NC',
                seo_description: 'Follow the complete journey of our hemp plants from germination to harvest in our state-of-the-art indoor facility. Learn about our quality-focused cultivation process.'
            })
        });

        const postResult = await postResponse.text();
        
        return new Response(JSON.stringify({
            success: true,
            message: 'Blog data initialized successfully',
            categoryResponse: categoriesResponse.status,
            postResponse: postResponse.status,
            postResult: postResult
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            error: {
                code: 'INIT_ERROR',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});