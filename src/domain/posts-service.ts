
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {postsRepository} from "../repositories/posts-db-repository";
import {BloggersExtendedType, PostsOfBloggerType, PostType} from "../repositories/db";



export const postsService = {
    async getAllPosts (pageNumber: number = 1, pageSize:number = 10): Promise<PostsOfBloggerType | undefined | null> {
        return await postsRepository.getAllPosts(pageNumber, pageSize)
    },

    async createPost (title: string, shortDescription: string, content: string, bloggerId: number): Promise<PostType | undefined> {
        const blogger = await bloggersRepository.getBloggerById(bloggerId)
        if (blogger) {
            const newPost = {
                id: +(new Date()),
                title,
                shortDescription,
                content,
                bloggerId,
                bloggerName: blogger.name
            }

            const createdPost = await postsRepository.createPost(newPost)
            return createdPost
        }
    },

    async getPostById (postId: number): Promise<PostType | null> {

        return postsRepository.getPostById(postId)
    },

    async updatePost (postId: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<boolean>  {
        return postsRepository.updatePost(postId, title, shortDescription, content, bloggerId)
    },

    async deletePost (postId: number): Promise<boolean>  {
        return postsRepository.deletePost(postId)
    }
}
