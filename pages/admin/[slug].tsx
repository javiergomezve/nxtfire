import AuthCheck from "../../components/AuthCheck";
import {useState} from "react";
import {useRouter} from "next/router";
import {auth, firestore, serverTimestamp} from "../../lib/firebase";
import {useDocumentData} from "react-firebase-hooks/firestore";
import styles from '../../styles/Admin.module.css';
import {useForm} from "react-hook-form";
import ReactMarkdown from "react-markdown";
import {toast} from "react-hot-toast";
import Link from "next/link";
import ImageUploader from "../../components/ImageUploader";

const AdminPostEdit = () => {

    return (
        <AuthCheck>
            <PostManager />
        </AuthCheck>
    );
};

export default AdminPostEdit;

interface IPost {
    title: string;
    slug: string;
    username: string;
}

const PostManager = () => {
    const [preview, setPreview] = useState(false);

    const router = useRouter();
    const {slug} = router.query;

    const postRef = firestore.collection('users').doc(auth.currentUser.uid)
        .collection('posts').doc(slug.toString());

    const [post] = useDocumentData<IPost>(postRef);

    return (
        <main className={styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <PostForm postRef={postRef} defaultValues={post} preview={preview} />
                    </section>

                    <aside>
                        <h3>Tools</h3>

                        <button onClick={() => setPreview(!preview)}>
                            {preview ? 'Edit' : 'Preview'}
                        </button>

                        <Link href={`/${post.username}/${post.slug}`}>
                            <button className="btn-blue">Live view</button>
                        </Link>
                    </aside>
                </>
            )}
        </main>
    );
};

const PostForm = ({defaultValues, postRef, preview}) => {
    const {register, handleSubmit, reset, watch, formState, errors} = useForm({defaultValues, mode: 'onChange'});

    const {isValid, isDirty} = formState;

    const updatePost = async ({content, published}) => {
        await postRef.update({
            content,
            published,
            updatedAt: serverTimestamp(),
        });

        reset({content, published});

        toast.success('Post updated successfully!');
    };

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}

            <div className={preview ? styles.hidden : styles.controls}>
                <ImageUploader/>

                <textarea name="content" ref={register({
                    maxLength: {value: 20000, message: 'content us too long'},
                    minLength: {value: 10, message: 'content us too short'},
                    required: {value: true, message: 'content is required'},
                })} />

                {errors.content && <p className="text-danger">{errors.content.message}</p>}

                <fieldset>
                    <input type="checkbox" className={styles.checkbox} name="published" ref={register} />
                    <label>Published</label>
                </fieldset>

                <button className="btn-green" type="submit" disabled={!isDirty || !isValid}>
                    Save changes
                </button>
            </div>
        </form>
    );
};
