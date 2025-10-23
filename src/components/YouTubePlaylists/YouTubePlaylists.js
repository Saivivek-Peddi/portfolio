import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import './YouTubePlaylists.css';
import { youtubePlaylistsData } from '../../data/youtubePlaylistsData';

function YouTubePlaylists() {
    const { theme } = useContext(ThemeContext);

    if (!youtubePlaylistsData || youtubePlaylistsData.length === 0) {
        return null;
    }

    return (
        <div
            className="youtube-playlists"
            id="youtube"
            style={{ backgroundColor: theme.secondary }}
        >
            <div className="youtube-playlists--header">
                <h1 style={{ color: theme.primary }}>Videos & Lectures</h1>
            </div>
            <div className="youtube-playlists--body">
                {youtubePlaylistsData.map((playlist) => (
                    <div key={playlist.id} className="playlist-section">
                        <div className="playlist-header">
                            <h2 style={{ color: theme.tertiary }}>{playlist.title}</h2>
                            <p style={{ color: theme.tertiary80 }}>{playlist.description}</p>
                        </div>
                        <div className="playlist-embed">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/videoseries?list=${playlist.playlistId}`}
                                title={playlist.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{
                                    borderRadius: '12px',
                                    boxShadow:
                                        theme.type === 'dark'
                                            ? '0 8px 24px rgba(0,0,0,0.4)'
                                            : '0 8px 24px rgba(0,0,0,0.15)',
                                }}
                            ></iframe>
                        </div>
                        <div className="playlist-link">
                            <a
                                href={`https://www.youtube.com/playlist?list=${playlist.playlistId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: theme.primary,
                                    backgroundColor: theme.primary30,
                                    borderColor: theme.primary,
                                }}
                            >
                                View Full Playlist on YouTube →
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default YouTubePlaylists;
