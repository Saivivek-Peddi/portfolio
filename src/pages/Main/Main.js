import React from 'react'
import { Helmet } from 'react-helmet'

import { Navbar, Footer, Landing, About, Skills, Blog, Education, Experience, Contacts, Projects, Achievement, YouTubePlaylists } from '../../components'
import { headerData } from '../../data/headerData'

function Main() {
    return (
        <div>
            <Helmet>
                <title>{headerData.name} - Porfolio</title>
            </Helmet>

            <Navbar />
            <Landing />
            <About />
            <Experience />
            <Education />
            <Skills />
            <Projects />
            <Achievement />
            <YouTubePlaylists />
            <Blog />
            <Contacts />
            <Footer />
        </div>
    )
}

export default Main
