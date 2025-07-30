import { GetPostHandler } from './getPost.handler';
import { GetPostsHandler } from './getPosts.handler';
import { GetPostsByUserHandler } from './getPostsByUser.handler';

export const PostsQueryHandlers = [
	GetPostsHandler,
	GetPostHandler,
	GetPostsByUserHandler,
];
