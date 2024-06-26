import React, { useEffect } from "react";
import "bulma/bulma.scss";
import "@fortawesome/fontawesome-free/css/all.css";
import "./App.scss";

import classNames from "classnames";
import { PostsList } from "./components/PostsList";
import { PostDetails } from "./components/PostDetails";
import { UserSelector } from "./components/UserSelector";
import { Loader } from "./components/Loader";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import * as postsActions from "./features/postsSlice";

export const App: React.FC = () => {
  const dispach = useAppDispatch();
  const { posts, loading, hasError } = useAppSelector((state) => state.posts);

  const author = useAppSelector((state) => state.users.selectedUser);
  const selectedPost = useAppSelector((state) => state.posts.selectedPost);

  useEffect(() => {
    dispach(postsActions.clearSelectedPost());

    if (author) {
      dispach(postsActions.init(author.id));
    } else {
      dispach(postsActions.clearPosts());
    }
  }, [author?.id]);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector />
              </div>

              <div className="block" data-cy="MainContent">
                {!author && <p data-cy="NoSelectedUser">No user selected</p>}

                {author && loading && <Loader />}

                {author && !loading && hasError && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {author && !loading && !hasError && posts.length === 0 && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}

                {author && !loading && !hasError && posts.length > 0 && (
                  <PostsList />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              "tile",
              "is-parent",
              "is-8-desktop",
              "Sidebar",
              {
                "Sidebar--open": selectedPost,
              }
            )}
          >
            <div className="tile is-child box is-success ">
              {selectedPost && <PostDetails />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
