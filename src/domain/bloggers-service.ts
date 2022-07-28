import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {BloggersExtendedType, BloggersType, PostsOfBloggerType, PostType} from "../repositories/db";
import {postsRepository} from "../repositories/posts-db-repository";


export const bloggersService = {

    async getAllBloggers(pageNumber: number = 1, pageSize:number = 10): Promise<BloggersExtendedType | undefined | null> {
        return await bloggersRepository.getAllBloggers(pageNumber, pageSize)


    },

    async createBlogger(name: string, youtubeUrl: string): Promise<BloggersType> {
        const newBlogger = {
            id: +(new Date()),
            name,
            youtubeUrl
        }
        const createdBlogger = await bloggersRepository.createBlogger(newBlogger)
        return createdBlogger;
    },

    async getBloggerById(bloggerId: number): Promise<BloggersType | null> {
        return await bloggersRepository.getBloggerById(bloggerId);
    },

    async updateBlogger(bloggerId: number, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(bloggerId, name, youtubeUrl)
    },

    async deleteBlogger(bloggerId: number): Promise<boolean> {
        return bloggersRepository.deleteBlogger(bloggerId)
    },

    async getPostsByBloggerId(bloggerId: number, pageNumber: number = 1, pageSize:number = 10): Promise<PostsOfBloggerType | null> {

        const posts = await bloggersRepository.getPostsByBloggerId(bloggerId, pageNumber, pageSize);

        return posts
    },

    async createPostByBloggerId (bloggerId: number, title: string, shortDescription: string, content: string): Promise<PostType | undefined> {
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
    }
}
