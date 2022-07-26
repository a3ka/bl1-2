import {bloggersCollection, BloggersType, client} from "./db";



export const bloggersRepository = {

    async getAllBloggers (): Promise<BloggersType[] | undefined > {

        return bloggersCollection.find({}).toArray()
        // return __bloggers;
    },

    async createBlogger (name: string, youtubeUrl: string): Promise<BloggersType> {
        const newBlogger = {
            id: +(new Date()),
            name,
            youtubeUrl
        }
        const result = await bloggersCollection.insertOne(newBlogger)
        // __bloggers.push(newBlogger)
        return newBlogger;
    },

    async getBloggerById (bloggerId: number): Promise<BloggersType | null>  {
        const blogger: BloggersType | null = await bloggersCollection.findOne({id: bloggerId})

        // const blogger = __bloggers.find(b => b.id === bloggerId);
        return blogger;
    },

    async deleteBlogger (bloggerId: number): Promise<boolean> {

        const result = await bloggersCollection.deleteOne({id: bloggerId})

        return result.deletedCount === 1
    },

    async updateBlogger (bloggerId: number, name: string, youtubeUrl: string): Promise<boolean> {

        // const blogger = __bloggers.find(b => b.id === bloggerId);
        const result = await bloggersCollection.updateOne({id: bloggerId}, {$set: {name: name, youtubeUrl: youtubeUrl}})

        return result.matchedCount === 1

    }
}
