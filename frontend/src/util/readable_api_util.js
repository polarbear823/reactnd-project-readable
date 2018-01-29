const ROOT_API_URL = 'http://localhost:3001/';
const headers = {
    headers:{'Authorization': 'whatever-you-want'}
};
const custom_headers = methodType => {
    return (
        {
            method: methodType,
            headers:{'Authorization': 'whatever-you-want'}
        }
    );
};

export const fetchCategories = () => fetch(`${ROOT_API_URL}categories`, custom_headers('GET'))
                                        .then(data => data.json())
                                        .then(data => data.categories);
export const fetchPosts = () => fetch(`${ROOT_API_URL}posts`, headers)
                                        .then(data => data.json());
export const fetchCategoryPosts = (category) => fetch(`${ROOT_API_URL}${category}/posts`, headers)
                                                    .then(data => data.json());
export const postNewPost = (newPost) => fetch(`${ROOT_API_URL}posts`, {
    method: 'POST',
    headers: {
                'Authorization': 'whatever-you-want',
                'Content-Type': 'application/json'
             },
    body: JSON.stringify(newPost)
});

export const editPost = (postId, content) => fetch(`${ROOT_API_URL}posts/${postId}`, {
    method: 'PUT',
    headers: {
                'Authorization': 'whatever-you-want',
                'Content-Type': 'application/json'
             },
     body: JSON.stringify(content)
});

export const deletePost = (postId) => fetch(`${ROOT_API_URL}posts/${postId}`, custom_headers('DELETE'))
                                            .then(res => res.json());
                                            
export const fetchPost = postId => fetch(`${ROOT_API_URL}posts/${postId}`, custom_headers('GET'))
                                        .then(data => data.json());

export const votePost = (postId, option) => fetch(`${ROOT_API_URL}posts/${postId}`, {
    method: 'POST',
    headers: {
                'Authorization': 'whatever-you-want',
                'Content-Type': 'application/json'
             },
     body: JSON.stringify({option})
}).then(res => res.json());

export const fetchCommentsForPost = postId => fetch(`${ROOT_API_URL}posts/${postId}/comments`, custom_headers('GET'))
                                                .then(data => data.json());

export const addComment = newComment => fetch(`${ROOT_API_URL}comments`, {
    method: 'POST',
    headers: {
                'Authorization': 'whatever-you-want',
                'Content-Type': 'application/json'
             },
    body: JSON.stringify(newComment)
}); 
                                                
export const editComment = (commentId, content) => fetch(`${ROOT_API_URL}comments/${commentId}`, {
    method: 'PUT',
    headers: {
                'Authorization': 'whatever-you-want',
                'Content-Type': 'application/json'
             },
     body: JSON.stringify(content)
});

export const deleteComment = commentId => fetch(`${ROOT_API_URL}comments/${commentId}`, custom_headers('DELETE'))
                                            .then(res => res.json());

export const voteComment = (commentId, option) => fetch(`${ROOT_API_URL}comments/${commentId}`, {
    method: 'POST',
    headers: {
                'Authorization': 'whatever-you-want',
                'Content-Type': 'application/json'
             },
     body: JSON.stringify({option})
}).then(res => res.json());                                            