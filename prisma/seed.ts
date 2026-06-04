import 'dotenv/config'
import { prisma as db }  from "@/lib/db";


async function main(){

    // clearing data first if any existing
    // we do this to prevent duplication
    await db.componentRequest.deleteMany();
    await db.cat.deleteMany();
    await db.joke.deleteMany();
    await db.quote.deleteMany();
    await db.user.deleteMany();

    await db.joke.createMany({
        data: [
            {
                setup: "Why do programmers always mix up Christmas and Halloween?",
                punchline: "Because Oct 31 equals Dec 25.",
            },
            {
                setup: "A developer's kid asked why is the sky blue?",
                punchline: "He said works on my machine.",
            },
            {
                setup: "Why did the React developer get kicked out of school?",
                punchline: "Because he kept getting caught with hooks.",
            },
            {
                setup: "I told my wife she should embrace her mistakes.",
                punchline: "She gave me a hug.",
            },
            {
                setup: "Why did the database administrator leave his wife?",
                punchline: "She had one too many relationships.",
            },]
    })

    await db.quote.createMany({
        data: [
            {
                text: "The best error message is the one that never shows up.",
                author: "Thomas Fuchs",
            },
            {
                text: "First, solve the problem. Then, write the code.",
                author: "John Johnson",
            },
            {
                text: "Experience is the name everyone gives to their mistakes.",
                author: "Oscar Wilde",
            },
            {
                text: "Code is like humor. When you have to explain it, it is bad.",
                author: "Cory House",
            },
            {
                text: "Simplicity is the soul of efficiency.",
                author: "Austin Freeman",
            },
        ]
    })

    await db.cat.createMany({
        data: [
            {
                name: "cat1-img",
                imageUrl:"https://res.cloudinary.com/cloudinary-images-01/image/upload/v1780487753/cat-03_n4ebap.jpg"
            },
            {
                name: "cat2-img",
                imageUrl:"https://res.cloudinary.com/cloudinary-images-01/image/upload/v1780487753/cat-02_el7bch.jpg"
            },
            {
                name: "cat3-img",
                imageUrl:"https://res.cloudinary.com/cloudinary-images-01/image/upload/v1780487753/cat-05_hxbdws.jpg"
            },
            {
                name: "cat4-img",
                imageUrl:"https://res.cloudinary.com/cloudinary-images-01/image/upload/v1780487753/cat-04_gm1qe3.jpg"
            },
            {
                name: "cat5-img",
                imageUrl:"https://res.cloudinary.com/cloudinary-images-01/image/upload/v1780487753/cat-01_xtltsq.jpg"
            }
        ]
    })

    await db.user.createMany({
        data: [
            // Users
        {
            name: "Ahmed Khan",
            bio: "Frontend developer obsessed with clean UI",
            avatarUrl: "https://res.cloudinary.com/cloudinary-images-01/image/upload/v1780487790/headshot-03_blrukd.jpg",
        },
        {
            name: "Sara Malik",
            bio: "Full stack engineer and coffee addict",
            avatarUrl: "https://res.cloudinary.com/cloudinary-images-01/image/upload/v1780487791/headshot-04_syi8tz.jpg",
        },
        {
            name: "James Carter",
            bio: "Designer who codes, coder who designs",
            avatarUrl: "https://res.cloudinary.com/cloudinary-images-01/image/upload/v1780487790/headshot-01_lcccj1.jpg",
        },
        {
            name: "Jon Doe",
            bio: "Building products that people actually enjoy",
            avatarUrl: "https://res.cloudinary.com/cloudinary-images-01/image/upload/v1780487790/headshot-02_qchbcv.jpg",
        },
        {
            name: "Lena Fischer",
            bio: "Open source contributor and dog mom",
            avatarUrl: "https://res.cloudinary.com/cloudinary-images-01/image/upload/v1780487791/headshot-05_ttsmpg.jpg",
        },
        ]
    })
}

main()
    .then(() => {
        console.log("Seeding complete");
    })
    .catch((error) => {
        console.error("Seeding failed: ", error);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    })