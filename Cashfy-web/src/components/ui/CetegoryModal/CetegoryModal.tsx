import { useEffect, useState, useRef, type FC } from "react";
import type { Category, CreateCategoryRequest, CategoryType } from "../../../types/Category";
import styles from "./CetegoryModal.module.css";
import 'emoji-picker-element';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'emoji-picker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                class?: string;
            };
        }
    }
}

interface CategoryModalProps {
    isOpen: boolean;
    selectedCategory: Category | null;
    onClose: () => void;
    onCreate: (data: CreateCategoryRequest) => Promise<void>;
    onSave: (data: CreateCategoryRequest) => Promise<void>;
}

export const CetegoryModal: FC<CategoryModalProps> = ({ isOpen, selectedCategory, onClose, onCreate, onSave }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [type, setType] = useState<CategoryType>("EXPENSE");
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("📁");
    const [color, setColor] = useState("#000000");

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const pickerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (selectedCategory) {
            setType(selectedCategory.type);
            setName(selectedCategory.name);
            setIcon(selectedCategory.icon || "📁");
            setColor(selectedCategory.color || "#000000");
            setError(null);
        } else {
            setType("EXPENSE");
            setName("");
            setIcon("📁");
            setColor("#000000");
            setError(null);
        }
        setShowEmojiPicker(false);
    }, [selectedCategory, isOpen]);

    useEffect(() => {
        const picker = pickerRef.current;
        if (!picker) return;

        const handleEmojiSelect = (event: any) => { 
            const selectedEmoji = event.detail.unicode;
            if (selectedEmoji) {
                setIcon(selectedEmoji);
                setShowEmojiPicker(false);
            }
        };

        picker.addEventListener('emoji-click', handleEmojiSelect); 

        return () => {
            picker.removeEventListener('emoji-click', handleEmojiSelect);
        };
    }, [showEmojiPicker]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !type || !icon || !color) {
            setError("All fields are required");
            return;
        }

        const payload: CreateCategoryRequest = {
            name: name.trim(),
            type,
            icon,
            color,
        };

        try {
            setLoading(true);
            setError(null);

            if (selectedCategory) {
                await onSave(payload);
            } else {
                await onCreate(payload);
            }

            setShowEmojiPicker(false);
            onClose();
        } catch {
            setError("Failed to save category. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.containerPrincipal}>
            <div className={styles.containerSecundario}>
                <button className={styles.buttonExitModal} type="button" onClick={onClose} disabled={loading}>
                    X
                </button>
                <h1>{selectedCategory ? "Edit category" : "Create category"}</h1>
                <form onSubmit={handleSubmit}>
                    {error && <p>{error}</p>}
                    <div className={styles.checkBoxContainer}>
                        <label htmlFor="type">Type of movement</label>
                        <div className={styles.checkBox}>
                            <div>
                                <label htmlFor="type_expense">Expense:</label>
                                <input
                                    id="type_expense"
                                    type="checkbox"
                                    name="type"
                                    value="EXPENSE"
                                    checked={type === "EXPENSE"}
                                    onChange={(e) => setType(e.target.value as CategoryType)}
                                />
                            </div>
                            <div>
                                <label htmlFor="type_income">Income:</label>
                                <input
                                    id="type_income"
                                    type="checkbox"
                                    name="type"
                                    value="INCOME"
                                    checked={type === "INCOME"}
                                    onChange={(e) => setType(e.target.value as CategoryType)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={styles.formGroup} style={{ position: 'relative' }}>
                        <label>Icon</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                                type="button"
                                className={styles.IconSelectorButton}
                                style={{ margin: 0, padding: '4px 12px' }}
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                {showEmojiPicker ? 'Close' : 'Choose Icon ' + icon}
                            </button>
                        </div>
                        {showEmojiPicker && (
                            <div style={{ position: 'absolute', zIndex: 10, marginTop: '8px', width: '100%', maxWidth: '320px', bottom: '-300px' }}>
                                <emoji-picker
                                    ref={pickerRef}
                                    style={{ height: '300px', width: '100%' }}
                                />
                            </div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="color">Color</label>
                        <input
                            type="color"
                            id="color"
                            className={styles.colorInput}
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button className={styles.buttonModal} type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
