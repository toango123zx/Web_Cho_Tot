import { CreatePostHandler } from './createPost.handler';
import { DeletePostHandler } from './deletePost.handler';
import { UpdatePostHandler } from './updatePost.handler';

export const PostsCommandHandlers = [
	CreatePostHandler,
	UpdatePostHandler,
	DeletePostHandler,
];
