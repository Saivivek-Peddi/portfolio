import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import './Blog.css';
import { ThemeContext } from '../../contexts/ThemeContext';


function Blog() {

    const { theme } = useContext(ThemeContext);

    const useStyles = makeStyles(() => ({
        viewBtn : {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '8px',
            border: `2px solid ${theme.primary}`,
            color: theme.tertiary,
            backgroundColor: theme.primary,
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            transition: 'all 0.3s',
            '&:hover': {
                backgroundColor: theme.primary600,
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
        },
    }));

    const classes = useStyles();

    const handleIframeClick = () => {
        window.open('https://f20150220.gitlab.io/blogs-and-projects/', '_blank');
    };

    return (
        <div className="blog" id="blog" style={{backgroundColor: theme.secondary}}>
            <div className="blog--header">
                <h1 style={{color: theme.primary}}>Blogs & Projects</h1>
                <p style={{color: theme.tertiary, textAlign: 'center', marginTop: '1rem', fontSize: '1.1rem'}}>
                    Technical writings, research articles, and project documentation
                </p>
            </div>
            <div className="blog--preview">
                <div
                    className="blog--iframe-container"
                    onClick={handleIframeClick}
                    style={{
                        cursor: 'pointer',
                        position: 'relative',
                    }}
                >
                    <iframe
                        src="https://f20150220.gitlab.io/blogs-and-projects/"
                        title="Blogs and Projects"
                        style={{
                            width: '100%',
                            height: '600px',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: theme.type === 'dark'
                                ? '0 8px 24px rgba(0,0,0,0.4)'
                                : '0 8px 24px rgba(0,0,0,0.15)',
                            pointerEvents: 'none',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'transparent',
                            cursor: 'pointer',
                        }}
                    />
                </div>
                <div className="blog--viewAll" style={{marginTop: '2rem'}}>
                    <a
                        href="https://f20150220.gitlab.io/blogs-and-projects/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes.viewBtn}
                    >
                        Visit Full Blog Site →
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Blog
