import React, { useEffect, useState } from "react";
import { Loader } from "./Loader";
import { NewCommentForm } from "./NewCommentForm";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import * as commentsActions from "../features/commentsSlice";

export const PostDetails: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const dispach = useAppDispatch();
  const post = useAppSelector((state) => state.posts.selectedPost);
  const { comments, loading, hasError } = useAppSelector(
    (state) => state.comments
  );

  useEffect(() => {
    setVisible(false);

    if (post) {
      dispach(commentsActions.init(post.id));
    }
  }, [post?.id]);

  const deleteComment = async (commentId: number) => {
    dispach(commentsActions.deleteComment(commentId));
  };

  return (
    <div className="content" data-cy="PostDetails">
      {post && (
        <div className="block">
          <h2 data-cy="PostTitle">{`#${post.id}: ${post.title}`}</h2>

          <p data-cy="PostBody">{post.body}</p>
        </div>
      )}

      <div className="block">
        {loading && <Loader />}

        {!loading && hasError && (
          <div className="notification is-danger" data-cy="CommentsError">
            Something went wrong
          </div>
        )}

        {!loading && !hasError && comments.length === 0 && (
          <p className="title is-4" data-cy="NoCommentsMessage">
            No comments yet
          </p>
        )}

        {!loading && !hasError && comments.length > 0 && (
          <>
            <p className="title is-4">Comments:</p>

            {comments.map((comment) => (
              <article
                className="message is-small"
                key={comment.id}
                data-cy="Comment"
              >
                <div className="message-header">
                  <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                    {comment.name}
                  </a>

                  <button
                    data-cy="CommentDelete"
                    type="button"
                    className="delete is-small"
                    aria-label="delete"
                    onClick={() => deleteComment(comment.id)}
                  />
                </div>

                <div className="message-body" data-cy="CommentBody">
                  {comment.body}
                </div>
              </article>
            ))}
          </>
        )}

        {!loading && !hasError && !visible && (
          <button
            data-cy="WriteCommentButton"
            type="button"
            className="button is-link"
            onClick={() => setVisible(true)}
          >
            Write a comment
          </button>
        )}

        {!loading && !hasError && visible && <NewCommentForm />}
      </div>
    </div>
  );
};
