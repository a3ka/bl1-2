export const bloggers = [
    {id: 1, name: 'Alex', youtubeUrl: 'https://www.alex.com'},
    {id: 2, name: 'Sasha', youtubeUrl: 'https://www.sasha.com'},
    {id: 3, name: 'Serg', youtubeUrl: 'https://www.serg.com'},
    {id: 4, name: 'Masha', youtubeUrl: 'https://www.masha.com'},
    {id: 5, name: 'Lena', youtubeUrl: 'https://www.lena.com'},
]

export const bloggersRepository = {
    getAllBloggers () {
        return bloggers;
    },

    createBlogger (name: string, youtubeUrl: string) {
        const newBlogger = {
            id: +(new Date()),
            name,
            youtubeUrl
        }
        bloggers.push(newBlogger)
        return newBlogger;
    },

    getBloggerById (bloggerId: number) {
        const blogger = bloggers.find(b => b.id === bloggerId);
        return blogger;
    },

    deleteBlogger (bloggerId: number) {
        for (let i = 0; i < bloggers.length; i++) {
            if (bloggers[i].id === bloggerId) {
                bloggers.splice(i, 1);
                return true;
            } else {
                return false;
            }
        }
    },

    updateBlogger (bloggerId: number, name: string, youtubeUrl: string) {

        const blogger = bloggers.find(b => b.id === bloggerId);

        if (blogger) {
            blogger.name = name
            blogger.youtubeUrl = youtubeUrl
            // blogPost.bloggerName = blogPost.bloggerName
            return true;
        } else {
            return false;
        }
    },
}