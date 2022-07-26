// import {__bloggers} from "./bloggers-db-repository";
import {client, postCollection, PostType} from "./db";
import {bloggersRepository} from "./bloggers-db-repository";


export const postsRepository = {
    async getAllPosts (): Promise<PostType[]> {
        return client.db("socialNetwork").collection<PostType>("posts").find({}).toArray()
    },

    async createPost (title: string, shortDescription: string, content: string, bloggerId: number): Promise<PostType | undefined> {
        // const blogger = __bloggers.find(b => b.id === +bloggerId);
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

            const result = await postCollection.insertOne(newPost)
            return newPost
        }
    },

    async getPostById (postId: number): Promise<PostType | null> {
        const post  = await postCollection.findOne({postId})
        return post;
    },

    async updatePost (postId: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<boolean>  {

        const result = await postCollection.updateOne({id: postId}, {$set: {title, shortDescription, content, bloggerId}})

        return result.matchedCount === 1

    },

    async deletePost (postId: number): Promise<boolean>  {

        const result = await postCollection.deleteOne({id: postId})

        return result.deletedCount === 1

        // let postCount = posts.length
        //
        // posts = posts.filter(b => b.id !== postId)
        //
        // if (postCount > posts.length) {
        //     return true;
        // } else {
        //     return false;
        // }

    }
}
