import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {BloggersType} from "../repositories/db";


export const bloggersService = {

    async getAllBloggers(): Promise<BloggersType[] | undefined> {
        return await bloggersRepository.getAllBloggers()
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

    async deleteBlogger(bloggerId: number): Promise<boolean> {
        return bloggersRepository.deleteBlogger(bloggerId)
    },

    async updateBlogger(bloggerId: number, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(bloggerId, name, youtubeUrl)
    }
}
