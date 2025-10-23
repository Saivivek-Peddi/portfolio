import awsLogo from '../assets/png/solutionsarchitect.png'
import langgraphLogo from '../assets/png/langgraph.png'
import ucdavisLogo from '../assets/png/ucdavis.png'

export const achievementData = {
    bio : "Throughout my career, I've maintained a commitment to continuous learning and professional development, earning industry certifications and taking on teaching roles that have strengthened both my technical expertise and ability to communicate complex concepts.",
    achievements : [
        {
            id : 1,
            title : 'AWS Certified Solutions Architect - Associate',
            details : 'Certified AWS Solutions Architect demonstrating expertise in designing distributed systems and applications on AWS cloud infrastructure with best practices.',
            date : '2023',
            field : 'Cloud Architecture',
            image : awsLogo
        },
        {
            id : 2,
            title : 'LangChain Academy - Introduction to LangGraph',
            details : 'Completed comprehensive course on building sophisticated AI agent workflows with LangGraph, demonstrating commitment to staying current with cutting-edge AI technologies.',
            date : '2024',
            field : 'Learning',
            image : langgraphLogo
        },
        {
            id : 3,
            title : 'Teaching Assistant at UC Davis',
            details : 'Served as TA for 4 semesters teaching Machine Learning, Programming Languages, and Design & Analysis of Algorithms, mentoring the next generation of computer scientists.',
            date : '2021-2022',
            field : 'Education',
            image : ucdavisLogo
        }

    ]
}


// Do not remove any fields.
// Leave it blank instead as shown below.

/*

export const achievementData = {
    bio : "",
    achievements : []
}

*/