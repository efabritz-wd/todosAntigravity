import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, LogOut, CheckCircle2, Circle, Edit2, Save, X } from 'lucide-react';

interface Todo {
    id: number;
    user_id: string;
    title: string;
    text: string;     // Description
    is_complete: boolean;
    inserted_at: string;
}

export default function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newText, setNewText] = useState('');
    const [loading, setLoading] = useState(true);

    // Editing State
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editText, setEditText] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/');
                return;
            }

            const { data, error } = await supabase
                .from('todos')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;
            // Map potential missing columns to avoid crashes if schema differs slightly
            const mappedTodos = (data || []).map(t => ({
                ...t,
                title: t.title || t.task || 'Untitled', // Fallback to 'task' if title missing
                text: t.text || '',
            }));
            setTodos(mappedTodos);
        } catch (error) {
            console.error('Error fetching todos:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('todos')
                .insert([{
                    title: newTitle,
                    text: newText,
                    user_id: user.id,
                }])
                .select()
                .single();

            if (error) throw error;
            setTodos([data, ...todos]);
            setNewTitle('');
            setNewText('');
        } catch (error: any) {
            console.error('Error adding todo:', error);
            if (error.message?.includes('violates not-null constraint') || error.message?.includes('column "title" does not exist')) {
                alert('Error: Database schema update required (missing title/text columns).');
            }
        }
    };

    const toggleComplete = async (todo: Todo) => {
        if (editingId === todo.id) return; // Prevent toggling while editing
        try {
            const { error } = await supabase
                .from('todos')
                .update({ is_complete: !todo.is_complete })
                .eq('id', todo.id);

            if (error) throw error;
            setTodos(todos.map(t => t.id === todo.id ? { ...t, is_complete: !t.is_complete } : t));
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const deleteTodo = async (id: number) => {
        try {
            const { error } = await supabase
                .from('todos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setTodos(todos.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const startEditing = (todo: Todo) => {
        setEditingId(todo.id);
        setEditTitle(todo.title);
        setEditText(todo.text);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditTitle('');
        setEditText('');
    };

    const saveEdit = async (id: number) => {
        if (!editTitle.trim()) return;

        try {
            const { error } = await supabase
                .from('todos')
                .update({ title: editTitle, text: editText })
                .eq('id', id);

            if (error) throw error;

            setTodos(todos.map(t => t.id === id ? { ...t, title: editTitle, text: editText } : t));
            setEditingId(null);
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <div className="container fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', fontWeight: 800 }}>My Tasks</h1>
                <Button variant="ghost" onClick={handleLogout}>
                    <LogOut size={20} /> Sign Out
                </Button>
            </div>

            <Card style={{ marginBottom: '2rem' }}>
                <form onSubmit={addTodo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input
                        placeholder="Task Title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                        autoFocus
                    />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Input
                            placeholder="Description (optional)"
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                        />
                        <Button type="submit" size="lg" style={{ minWidth: '3.5rem' }}>
                            <Plus size={24} />
                        </Button>
                    </div>
                </form>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading tasks...</p>
                ) : todos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <p>No tasks yet. Add one above to get started!</p>
                    </div>
                ) : (
                    todos.map((todo) => (
                        <Card
                            key={todo.id}
                            className="fade-in"
                            style={{
                                padding: '1.5rem',
                                display: 'flex',
                                alignItems: 'flex-start', // Align to top for multiline
                                justifyContent: 'space-between',
                                transition: 'all 0.2s ease',
                                opacity: todo.is_complete ? 0.7 : 1,
                                border: editingId === todo.id ? '2px solid var(--primary)' : undefined
                            }}
                        >
                            {editingId === todo.id ? (
                                // Edit Mode
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <Input
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        placeholder="Task Title"
                                    />
                                    <Input
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        placeholder="Description"
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <Button size="sm" variant="ghost" onClick={cancelEditing}>
                                            <X size={18} /> Cancel
                                        </Button>
                                        <Button size="sm" onClick={() => saveEdit(todo.id)}>
                                            <Save size={18} /> Save
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <>
                                    <div
                                        style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer', flex: 1 }}
                                        onClick={() => toggleComplete(todo)}
                                    >
                                        <div style={{ color: todo.is_complete ? 'var(--green-500)' : 'var(--text-muted)', marginTop: '0.2rem' }}>
                                            {todo.is_complete ?
                                                <CheckCircle2 size={24} color="var(--primary)" /> :
                                                <Circle size={24} />
                                            }
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span style={{
                                                textDecoration: todo.is_complete ? 'line-through' : 'none',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                color: todo.is_complete ? 'var(--text-muted)' : 'var(--text)'
                                            }}>
                                                {todo.title}
                                            </span>
                                            {todo.text && (
                                                <span style={{
                                                    fontSize: '0.95rem',
                                                    color: 'var(--text-muted)',
                                                    textDecoration: todo.is_complete ? 'line-through' : 'none',
                                                }}>
                                                    {todo.text}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => startEditing(todo)}
                                            style={{ color: 'var(--text-muted)' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                        >
                                            <Edit2 size={20} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteTodo(todo.id)}
                                            style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                        >
                                            <Trash2 size={20} />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
