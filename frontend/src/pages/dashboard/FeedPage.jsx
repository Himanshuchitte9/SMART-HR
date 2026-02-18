import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ThumbsUp, MessageCircle, Share2, Send, User, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const FeedPage = () => {
    const { user } = useAuthStore();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState('');

    useEffect(() => {
        fetchFeed();
    }, []);

    const fetchFeed = async () => {
        try {
            const { data } = await api.get('/network/feed');
            setPosts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        try {
            const { data } = await api.post('/network/posts', { content: newPost });
            setPosts([data, ...posts]);
            setNewPost('');
        } catch (error) {
            alert('Failed to post');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Your Feed</h1>
            </div>

            {/* Create Post */}
            <div className="rounded-xl border bg-card text-card-foreground shadow p-4">
                <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {user?.profile?.avatar ? <img src={user.profile.avatar} alt="" /> : <User className="h-6 w-6 text-primary" />}
                    </div>
                    <div className="flex-1">
                        <form onSubmit={handlePost}>
                            <textarea
                                className="w-full bg-transparent border-none resize-none focus:ring-0 text-sm min-h-[80px]"
                                placeholder="Start a post..."
                                value={newPost}
                                onChange={e => setNewPost(e.target.value)}
                            />
                            <div className="flex justify-between items-center mt-2 pt-2 border-t">
                                <div className="flex gap-2">
                                    {/* Media buttons could go here */}
                                </div>
                                <Button size="sm" type="submit" disabled={!newPost.trim()}>
                                    <Send className="mr-2 h-3 w-3" /> Post
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                ) : posts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No posts yet. Be the first to share!</p>
                ) : (
                    posts.map(post => (
                        <div key={post._id} className="rounded-xl border bg-card text-card-foreground shadow p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                    {post.authorId?.profile?.avatar ? <img src={post.authorId.profile.avatar} alt="" /> : <User className="h-6 w-6 text-muted-foreground" />}
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">{post.authorId?.firstName} {post.authorId?.lastName}</div>
                                    <div className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className="mb-4 text-sm whitespace-pre-wrap">
                                {post.content}
                            </div>
                            <div className="flex items-center pt-3 border-t text-muted-foreground">
                                <Button variant="ghost" size="sm" className="flex-1">
                                    <ThumbsUp className="mr-2 h-4 w-4" /> Like
                                </Button>
                                <Button variant="ghost" size="sm" className="flex-1">
                                    <MessageCircle className="mr-2 h-4 w-4" /> Comment
                                </Button>
                                <Button variant="ghost" size="sm" className="flex-1">
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FeedPage;
