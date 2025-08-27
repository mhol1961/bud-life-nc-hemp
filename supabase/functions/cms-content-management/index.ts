Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { action, ...data } = await req.json();

    // Get environment variables
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    if (!serviceRoleKey || !supabaseUrl) {
      throw new Error('Supabase configuration missing');
    }

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authentication required');
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token and get user
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': serviceRoleKey
      }
    });

    if (!userResponse.ok) {
      throw new Error('Invalid authentication token');
    }

    const userData = await userResponse.json();
    const userId = userData.id;

    let result;

    switch (action) {
      case 'create_post':
        result = await createPost(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'update_post':
        result = await updatePost(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'delete_post':
        result = await deletePost(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'publish_post':
        result = await publishPost(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'bulk_operation':
        result = await bulkOperation(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'create_category':
        result = await createCategory(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'create_tag':
        result = await createTag(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'get_revisions':
        result = await getRevisions(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'restore_revision':
        result = await restoreRevision(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'schedule_post':
        result = await schedulePost(supabaseUrl, serviceRoleKey, userId, data);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('CMS content management error:', error);

    const errorResponse = {
      error: {
        code: 'CMS_CONTENT_MANAGEMENT_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Helper functions
async function createPost(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const {
    title,
    content,
    excerpt,
    slug,
    status = 'draft',
    categories = [],
    tags = [],
    featured_image_url,
    meta_title,
    meta_description,
    meta_keywords,
    scheduled_for
  } = data;

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  // Create the blog post (using existing blog_posts table)
  const postResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      title,
      content,
      excerpt: excerpt || generateExcerpt(content),
      slug: slug || generateSlug(title),
      author: userId, // Using author field from existing schema
      category_id: categories[0] || null, // Using single category from existing schema
      featured_image_url,
      seo_title: meta_title,
      seo_description: meta_description,
      is_published: status === 'published',
      published_at: status === 'published' ? new Date().toISOString() : scheduled_for,
      read_time: calculateReadingTime(content),
      is_featured: false
    })
  });

  if (!postResponse.ok) {
    const errorText = await postResponse.text();
    throw new Error(`Failed to create post: ${errorText}`);
  }

  const post = await postResponse.json();
  const postId = post[0].id;

  // Create initial revision
  await createRevision(supabaseUrl, serviceRoleKey, postId, {
    title,
    content,
    excerpt: excerpt || generateExcerpt(content),
    author_id: userId,
    changes_summary: 'Initial post creation',
    created_by: userId
  });

  // Handle additional categories if provided
  if (categories.length > 1) {
    const categoryPromises = categories.slice(1).map(categoryId => 
      fetch(`${supabaseUrl}/rest/v1/cms_post_categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ post_id: postId, category_id: categoryId })
      })
    );
    await Promise.all(categoryPromises);
  }

  // Handle tags
  if (tags.length > 0) {
    const tagPromises = tags.map(tagId => 
      fetch(`${supabaseUrl}/rest/v1/cms_post_tags`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ post_id: postId, tag_id: tagId })
      })
    );
    await Promise.all(tagPromises);
  }

  return { post: post[0], id: postId };
}

async function updatePost(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { id, changes_summary, ...updateData } = data;

  if (!id) {
    throw new Error('Post ID is required for updates');
  }

  // Get current post for revision
  const currentPostResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?id=eq.${id}`, {
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey
    }
  });

  if (currentPostResponse.ok) {
    const currentPosts = await currentPostResponse.json();
    if (currentPosts.length > 0) {
      const currentPost = currentPosts[0];
      
      // Create revision before updating
      await createRevision(supabaseUrl, serviceRoleKey, id, {
        title: currentPost.title,
        content: currentPost.content,
        excerpt: currentPost.excerpt,
        author_id: currentPost.author,
        changes_summary: changes_summary || 'Content updated',
        created_by: userId
      });
    }
  }

  // Update the blog post
  const updateResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      ...updateData,
      updated_at: new Date().toISOString()
    })
  });

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    throw new Error(`Failed to update post: ${errorText}`);
  }

  const updatedPost = await updateResponse.json();
  return { post: updatedPost[0] };
}

async function deletePost(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { id } = data;

  if (!id) {
    throw new Error('Post ID is required for deletion');
  }

  // Delete related records first
  await Promise.all([
    fetch(`${supabaseUrl}/rest/v1/cms_post_categories?post_id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }),
    fetch(`${supabaseUrl}/rest/v1/cms_post_tags?post_id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    })
  ]);

  // Delete the post
  const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey
    }
  });

  if (!deleteResponse.ok) {
    const errorText = await deleteResponse.text();
    throw new Error(`Failed to delete post: ${errorText}`);
  }

  return { success: true, deletedId: id };
}

async function publishPost(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { id, scheduleFor } = data;

  if (!id) {
    throw new Error('Post ID is required for publishing');
  }

  const updateData: any = {
    is_published: true,
    updated_at: new Date().toISOString()
  };

  if (scheduleFor) {
    updateData.published_at = scheduleFor;
  } else {
    updateData.published_at = new Date().toISOString();
  }

  const publishResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(updateData)
  });

  if (!publishResponse.ok) {
    const errorText = await publishResponse.text();
    throw new Error(`Failed to publish post: ${errorText}`);
  }

  const publishedPost = await publishResponse.json();
  return { post: publishedPost[0] };
}

async function bulkOperation(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { operation, postIds } = data;

  if (!operation || !postIds || !Array.isArray(postIds)) {
    throw new Error('Operation and post IDs are required for bulk operations');
  }

  const results = [];

  for (const postId of postIds) {
    try {
      switch (operation) {
        case 'publish':
          const publishResult = await publishPost(supabaseUrl, serviceRoleKey, userId, { id: postId });
          results.push({ id: postId, success: true, result: publishResult });
          break;
        case 'unpublish':
          const unpublishResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?id=eq.${postId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_published: false })
          });
          results.push({ id: postId, success: unpublishResponse.ok });
          break;
        case 'delete':
          const deleteResult = await deletePost(supabaseUrl, serviceRoleKey, userId, { id: postId });
          results.push({ id: postId, success: true, result: deleteResult });
          break;
        default:
          results.push({ id: postId, success: false, error: `Unknown operation: ${operation}` });
      }
    } catch (error) {
      results.push({ id: postId, success: false, error: error.message });
    }
  }

  return { operation, results };
}

async function createCategory(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { name, description, parentId } = data;

  if (!name) {
    throw new Error('Category name is required');
  }

  const categoryResponse = await fetch(`${supabaseUrl}/rest/v1/cms_categories`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      name,
      slug: generateSlug(name),
      description: description || '',
      parent_id: parentId || null
    })
  });

  if (!categoryResponse.ok) {
    const errorText = await categoryResponse.text();
    throw new Error(`Failed to create category: ${errorText}`);
  }

  const category = await categoryResponse.json();
  return { category: category[0] };
}

async function createTag(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { name, description, color } = data;

  if (!name) {
    throw new Error('Tag name is required');
  }

  const tagResponse = await fetch(`${supabaseUrl}/rest/v1/cms_tags`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      name,
      slug: generateSlug(name),
      description: description || '',
      color: color || '#3b82f6'
    })
  });

  if (!tagResponse.ok) {
    const errorText = await tagResponse.text();
    throw new Error(`Failed to create tag: ${errorText}`);
  }

  const tag = await tagResponse.json();
  return { tag: tag[0] };
}

// Utility functions
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength).trim() + '...'
    : plainText;
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Revision management functions
async function createRevision(supabaseUrl: string, serviceRoleKey: string, postId: string, data: any) {
  // Get current revision count
  const countResponse = await fetch(`${supabaseUrl}/rest/v1/cms_post_revisions?select=revision_number&post_id=eq.${postId}&order=revision_number.desc&limit=1`, {
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey
    }
  });

  let nextRevisionNumber = 1;
  if (countResponse.ok) {
    const revisions = await countResponse.json();
    if (revisions.length > 0) {
      nextRevisionNumber = revisions[0].revision_number + 1;
    }
  }

  const revisionResponse = await fetch(`${supabaseUrl}/rest/v1/cms_post_revisions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      post_id: postId,
      revision_number: nextRevisionNumber,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      author_id: data.author_id,
      changes_summary: data.changes_summary,
      created_by: data.created_by
    })
  });

  if (!revisionResponse.ok) {
    console.warn('Failed to create revision:', await revisionResponse.text());
  }
}

async function getRevisions(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { postId } = data;

  if (!postId) {
    throw new Error('Post ID is required to get revisions');
  }

  const revisionsResponse = await fetch(
    `${supabaseUrl}/rest/v1/cms_post_revisions?post_id=eq.${postId}&order=created_at.desc`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  if (!revisionsResponse.ok) {
    const errorText = await revisionsResponse.text();
    throw new Error(`Failed to fetch revisions: ${errorText}`);
  }

  const revisions = await revisionsResponse.json();
  return { revisions };
}

async function restoreRevision(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { postId, revisionId } = data;

  if (!postId || !revisionId) {
    throw new Error('Post ID and revision ID are required');
  }

  // Get the revision data
  const revisionResponse = await fetch(
    `${supabaseUrl}/rest/v1/cms_post_revisions?id=eq.${revisionId}`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  if (!revisionResponse.ok) {
    const errorText = await revisionResponse.text();
    throw new Error(`Failed to fetch revision: ${errorText}`);
  }

  const revisions = await revisionResponse.json();
  if (revisions.length === 0) {
    throw new Error('Revision not found');
  }

  const revision = revisions[0];

  // Create a new revision of current content before restoring
  await createRevision(supabaseUrl, serviceRoleKey, postId, {
    title: 'Current content',
    content: 'Current content',
    excerpt: 'Current content',
    author_id: userId,
    changes_summary: `Backup before restoring revision ${revision.revision_number}`,
    created_by: userId
  });

  // Restore the revision content
  const restoreResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?id=eq.${postId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      title: revision.title,
      content: revision.content,
      excerpt: revision.excerpt,
      updated_at: new Date().toISOString()
    })
  });

  if (!restoreResponse.ok) {
    const errorText = await restoreResponse.text();
    throw new Error(`Failed to restore revision: ${errorText}`);
  }

  const restoredPost = await restoreResponse.json();
  return { post: restoredPost[0], message: `Restored to revision ${revision.revision_number}` };
}

async function schedulePost(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { postId, scheduledFor } = data;

  if (!postId || !scheduledFor) {
    throw new Error('Post ID and scheduled date are required');
  }

  const scheduledDate = new Date(scheduledFor);
  if (scheduledDate <= new Date()) {
    throw new Error('Scheduled date must be in the future');
  }

  const updateResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?id=eq.${postId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      published_at: scheduledDate.toISOString(),
      is_published: false, // Will be published by scheduled job
      updated_at: new Date().toISOString()
    })
  });

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    throw new Error(`Failed to schedule post: ${errorText}`);
  }

  const scheduledPost = await updateResponse.json();
  return { post: scheduledPost[0], message: `Post scheduled for ${scheduledDate.toLocaleString()}` };
}
