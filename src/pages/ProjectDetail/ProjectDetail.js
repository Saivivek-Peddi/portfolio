import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AiOutlineHome } from 'react-icons/ai';
import { FaPlay, FaCode } from 'react-icons/fa';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeContext } from '../../contexts/ThemeContext';
import { projectsData } from '../../data/projectsData';
import { headerData } from '../../data/headerData';
import './ProjectDetail.css';

function ProjectDetail() {
    const { id } = useParams();
    const { theme } = useContext(ThemeContext);
    const project = projectsData.find((p) => p.id === parseInt(id));

    const useStyles = makeStyles((t) => ({
        home: {
            color: theme.secondary,
            position: 'absolute',
            top: 25,
            left: 25,
            padding: '7px',
            borderRadius: '50%',
            boxSizing: 'content-box',
            fontSize: '2rem',
            cursor: 'pointer',
            boxShadow:
                theme.type === 'dark'
                    ? '3px 3px 6px #ffffff40, -3px -3px 6px #00000050'
                    : '3px 3px 6px #ffffff40, -3px -3px 6px #00000050',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
                color: theme.tertiary,
                transform: 'scale(1.1)',
            },
            [t.breakpoints.down('sm')]: {
                fontSize: '1.8rem',
            },
        },
        iconBtn: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '8px',
            border: `2px solid ${theme.tertiary}`,
            color: theme.tertiary,
            backgroundColor: theme.secondary,
            textDecoration: 'none',
            transition: 'all 0.3s',
            fontSize: '1rem',
            fontWeight: 500,
            '&:hover': {
                backgroundColor: theme.primary,
                color: theme.secondary,
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
        },
    }));

    const classes = useStyles();

    if (!project) {
        return (
            <div
                className="projectDetail"
                style={{ backgroundColor: theme.secondary }}
            >
                <Helmet>
                    <title>{headerData.name} | Project Not Found</title>
                </Helmet>
                <div
                    className="projectDetail-header"
                    style={{ backgroundColor: theme.primary }}
                >
                    <Link to="/">
                        <AiOutlineHome className={classes.home} />
                    </Link>
                    <h1 style={{ color: theme.secondary }}>Project Not Found</h1>
                </div>
                <div className="projectDetail-container">
                    <p style={{ color: theme.tertiary }}>
                        The project you're looking for doesn't exist.
                    </p>
                    <Link
                        to="/projects"
                        style={{ color: theme.primary, marginTop: '20px' }}
                    >
                        Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className="projectDetail"
            style={{ backgroundColor: theme.secondary }}
        >
            <Helmet>
                <title>
                    {headerData.name} | {project.projectName}
                </title>
            </Helmet>
            <div
                className="projectDetail-header"
                style={{ backgroundColor: theme.primary }}
            >
                <Link to="/">
                    <AiOutlineHome className={classes.home} />
                </Link>
                <h1 style={{ color: theme.secondary }}>{project.projectName}</h1>
            </div>
            <div className="projectDetail-container">
                <div className="projectDetail-content">
                    <div className="projectDetail-image">
                        <img src={project.image} alt={project.projectName} />
                    </div>

                    <div
                        className="projectDetail-tags"
                        style={{
                            backgroundColor: theme.primary30,
                            borderColor: theme.primary,
                        }}
                    >
                        {project.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                style={{
                                    backgroundColor: theme.primary,
                                    color: theme.secondary,
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="projectDetail-links">
                        {project.demo && (
                            <a
                                href={project.demo}
                                target="_blank"
                                rel="noreferrer"
                                className={classes.iconBtn}
                            >
                                <FaPlay /> View Demo
                            </a>
                        )}
                        {project.code && (
                            <a
                                href={project.code}
                                target="_blank"
                                rel="noreferrer"
                                className={classes.iconBtn}
                            >
                                <FaCode /> View Code
                            </a>
                        )}
                    </div>

                    <div
                        className="projectDetail-section"
                        style={{ color: theme.tertiary }}
                    >
                        <h2 style={{ color: theme.primary }}>Overview</h2>
                        <p>{project.projectDesc}</p>
                    </div>

                    {project.fullDescription && (
                        <div
                            className="projectDetail-section"
                            style={{ color: theme.tertiary }}
                        >
                            <h2 style={{ color: theme.primary }}>
                                Detailed Description
                            </h2>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: project.fullDescription,
                                }}
                            />
                        </div>
                    )}

                    {project.keyFeatures && project.keyFeatures.length > 0 && (
                        <div
                            className="projectDetail-section"
                            style={{ color: theme.tertiary }}
                        >
                            <h2 style={{ color: theme.primary }}>Key Features</h2>
                            <ul className="projectDetail-features">
                                {project.keyFeatures.map((feature, idx) => (
                                    <li key={idx}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {project.technicalDetails && (
                        <div
                            className="projectDetail-section"
                            style={{ color: theme.tertiary }}
                        >
                            <h2 style={{ color: theme.primary }}>
                                Technical Details
                            </h2>
                            <p>{project.technicalDetails}</p>
                        </div>
                    )}

                    {project.impact && (
                        <div
                            className="projectDetail-section"
                            style={{ color: theme.tertiary }}
                        >
                            <h2 style={{ color: theme.primary }}>Impact & Results</h2>
                            <p>{project.impact}</p>
                        </div>
                    )}
                </div>

                <div className="projectDetail-back">
                    <Link
                        to="/projects"
                        className={classes.iconBtn}
                    >
                        ← Back to Projects
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ProjectDetail;
