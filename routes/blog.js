const User = require('../models/users');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const config = require('../config/databse');

module.exports = (router) => {

    router.post('/newBlog', (req, res) => {
        console.log("req.body", req.body)
        if (!req.body.title) {
            res.send({
                success: false,
                msg: "Title is requred"
            })
        }
        else {
            if (!req.body.body) {
                res.send({
                    success: false,
                    msg: "Description is requred"
                })
            }
            else {
                if (!req.body.createdBy) {
                    res.send({
                        success: false,
                        msg: "Need to write who created the post"
                    })
                } else {
                    const blog = new Blog({
                        title: req.body.title,
                        body: req.body.body,
                        createdBy: req.body.createdBy,
                        createdAt: req.body.createdAt
                    })
                    blog.save((err, result) => {
                        console.log("new post is" , result);
                        res.send({
                            data : result
                        })
                        // if (err) {

                        //     if (err.errors) {
                        //                     if (err.errors.title) {
                        //                         res.send({ success: false, msg: err.errors.title.msg })
                        //                     }
                        //                     else {
                        //                             if (err.errors.body) {
                        //                                 res.send({ success: false, msg: err.errors.body.msg })
                        //                             }
                        //                             else {
                        //                                 res.send({ success: false, msg: err.errmsg })
                        //                             }
                        //                     }
                        //                 }
                        //         else {
                        //             res.send({
                        //                 success: false,
                        //                 msg: err
                        //             })
                        //         }
                        //     }

                        // else {
                        //     res.send({
                        //         success: true,
                        //         msg: "Post created",
                        //         postInfo: result
                        //     })
                        // }
                       
                    });

                }
            }
        }
    })

    router.get('/allBlogs', (req, res) => {
        Blog.find({}, (err, result) => {
            console.log(result);

            if (err) {
                res.send({
                    success: false,
                    msg: err
                })
            }
            else {
                if (!result) {
                    res.send({
                        success: false,
                        msg: "No blogs found"
                    })
                }
                else {
                    res.send({
                        success: true,
                        msg: result
                    })
                }
            }

        }).sort({ '_id': -1 });  // to put newest blogs on top
    })

    router.get('/singleBlog/:id', (req, res) => {

        console.log("req.params for edit", req.params);

        Blog.findOne({ _id: req.params.id }, (err, blog) => {
            console.log("result is", blog)
            if (err) {
                res.send({
                    success: false,
                    msg: "Not valid blog id"
                })
            }
            else {
                if (!blog) {
                    res.send({

                        super: false,
                        msg: "Blog Not Found"
                    })
                }
                else {
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                        if (err) {
                            res.send({
                                success: false,
                                msg: err
                            })
                        }
                        else {
                            if (!user) {
                                res.send({
                                    success: false,
                                    msg: 'Unable to authenticate user'
                                })
                            }
                            else {
                                if (user.username !== blog.createdBy) {
                                    res.send({
                                        success: false,
                                        msg: 'You are not able to authorize to edit this blog'
                                    })
                                }
                                else {
                                    res.send({
                                        success: true,
                                        msg: blog
                                    })
                                }
                            }
                        }
                    })
                }
            }
        });
    })

    router.put('/updateBlog', (req, res) => {
        console.log("id blog", req.body)
        if (!req.body._id) {
            res.send({
                success: false,
                msg: 'No blog id provided'
            })
        }
        else {
            Blog.findOne({ _id: req.body._id }, (err, blog) => {
                if (err) {
                    res.send({
                        success: false,
                        msg: 'not valid blog id'
                    })
                }
                else {
                    if (!blog) {
                        res.send({
                            success: false,
                            msg: 'blog id not found'
                        })
                    }
                    else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.send({
                                    success: false,
                                    msg: err
                                })
                            }
                            else {
                                if (err) {
                                    res.send({
                                        success: false,
                                        msg: "Unable to authenticate user"
                                    })
                                }
                                else {
                                    if (user.username !== blog.createdBy) {
                                        res.send({
                                            success: false,
                                            msg: 'You are not authorized to edit this post'
                                        })
                                    }
                                    else {
                                        blog.title = req.body.title;
                                        blog.body = req.body.body
                                        blog.save((err) => {
                                            if (err) {
                                                res.send({
                                                    success: false,
                                                    msg: err
                                                })
                                            }
                                            else {
                                                res.send({
                                                    success: true,
                                                    msg: "Blog Updated"
                                                })
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }
    });

    router.delete('/deleteBlog/:id', (req, res) => {

        if (!req.params.id) {
            res.send({
                success: false,
                msg: 'No id provided'
            })
        }
        else {
            Blog.findOne({ _id: req.params.id }, (err, blog) => {
                if (err) {
                    res.send({
                        success: false,
                        msg: 'Invalid id'
                    })
                }
                else {
                    if (!blog) {
                        res.send({
                            success: false,
                            msg: 'Id not found'
                        })
                    }
                    else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.send({
                                    success: false,
                                    msg: err
                                })
                            }
                            else {
                                if (!user) {
                                    res.send({
                                        success: false,
                                        msg: 'Unable to authenticate user'
                                    })
                                }
                                else {
                                    if (user.username !== blog.createdBy) {
                                        res.send({
                                            success: false,
                                            msg: 'You are not authorized to delete this post'
                                        })

                                    }
                                    else {
                                        blog.remove((err) => {
                                            if (err) {
                                                res.send({
                                                    success: false,
                                                    msg: err
                                                })
                                            }
                                            else {
                                                res.send({
                                                    success: true,
                                                    msg: 'Blog deleted'
                                                })
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }
    })

    router.put('/likeBlog', (req, res) => {
        if (!req.body.id) {
            res.send({
                success: false,
                msg: 'No id was provided.'
            });
        } else {

            Blog.findOne({ _id: req.body.id }, (err, blog) => {

                if (err) {
                    res.send({
                        success: false,
                        msg: 'Invalid blog id'
                    });
                } else {
                    if (!blog) {
                        res.send({
                            success: false,
                            msg: 'That blog was not found.'
                        });
                    } else {

                        User.findOne({ _id: req.decoded.userId }, (err, user) => {

                            if (err) {
                                res.send({
                                    success: false,
                                    msg: 'Something went wrong.'
                                });
                            } else {
                                if (!user) {
                                    res.send({
                                        success: false,
                                        msg: 'Could not authenticate user.'
                                    });
                                } else {
                                    if (user.username === blog.createdBy) {
                                        res.send({
                                            success: false,
                                            msg: 'Cannot like your own post.'
                                        });
                                    }
                                    else {

                                        if (blog.likedBy.includes(user.username)) {
                                            res.send({
                                                success: false,
                                                msg: 'You already liked this post.'
                                            });
                                        }
                                        else {

                                            if (blog.dislikedBy.includes(user.username)) {
                                                blog.dislikes--;
                                                const arrayIndex = blog.dislikedBy.indexOf(user.username);
                                                blog.dislikedBy.splice(arrayIndex, 1);
                                                blog.likes++;
                                                blog.likedBy.push(user.username);

                                                blog.save((err) => {

                                                    if (err) {
                                                        res.send({
                                                            success: false,
                                                            msg: 'Something went wrong.'
                                                        });
                                                    }
                                                    else {
                                                        res.send({
                                                            success: true,
                                                            msg: 'Blog liked!'
                                                        });
                                                    }
                                                });
                                            } else {
                                                blog.likes++;
                                                blog.likedBy.push(user.username);
                                                blog.save((err) => {
                                                    if (err) {
                                                        res.send({
                                                            success: false,
                                                            msg: 'Something went wrong.'
                                                        });
                                                    } else {
                                                        res.send({
                                                            success: true,
                                                            msg: 'Blog liked!'
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });

    // //////////////////////////////////DISLIKE//////////////////////////////////////////////////
    router.put('/dislikeBlog', (req, res) => {
        if (!req.body.id) {
            res.send({
                success: false,
                msg: 'No id was provided.'
            });
        } else {

            Blog.findOne({ _id: req.body.id }, (err, blog) => {

                if (err) {
                    res.send({
                        success: false,
                        msg: 'Invalid blog id'
                    });
                } else {
                    if (!blog) {
                        res.send({
                            success: false,
                            msg: 'That blog was not found.'
                        });
                    } else {

                        User.findOne({ _id: req.decoded.userId }, (err, user) => {

                            if (err) {
                                res.send({
                                    success: false,
                                    msg: 'Something went wrong.'
                                });
                            } else {
                                if (!user) {
                                    res.send({
                                        success: false,
                                        msg: 'Could not authenticate user.'
                                    });
                                } else {
                                    if (user.username === blog.createdBy) {
                                        res.send({
                                            success: false,
                                            msg: 'Cannot dislike your own post.'
                                        });
                                    }
                                    else {

                                        if (blog.dislikedBy.includes(user.username)) {
                                            res.send({
                                                success: false,
                                                msg: 'You already disliked this post.'
                                            });
                                        }
                                        else {

                                            if (blog.likedBy.includes(user.username)) {
                                                blog.likes--;
                                                const arrayIndex = blog.likedBy.indexOf(user.username);
                                                blog.likedBy.splice(arrayIndex, 1);
                                                blog.dislikes++;
                                                blog.dislikedBy.push(user.username);

                                                blog.save((err) => {

                                                    if (err) {
                                                        res.send({
                                                            success: false,
                                                            msg: 'Something went wrong.'
                                                        });
                                                    }
                                                    else {
                                                        res.send({
                                                            success: true,
                                                            msg: 'Blog disliked!'
                                                        });
                                                    }
                                                });
                                            } else {
                                                blog.dislikes++;
                                                blog.dislikedBy.push(user.username);
                                                blog.save((err) => {
                                                    if (err) {
                                                        res.send({
                                                            success: false,
                                                            msg: 'Something went wrong.'
                                                        });
                                                    } else {
                                                        res.send({
                                                            success: true,
                                                            msg: 'Blog disliked!'
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });

     router.post('/comment', (req, res) => {
    // Check if comment was provided in request body
    if (!req.body.comment) {
      res.json({ success: false, message: 'No comment provided' }); // Return error message
    } else {
      // Check if id was provided in request body
      if (!req.body.id) {
        res.json({ success: false, message: 'No id was provided' }); // Return error message
      } else {
        // Use id to search for blog post in database
        Blog.findOne({ _id: req.body.id }, (err, blog) => {
          // Check if error was found
          if (err) {
            res.json({ success: false, message: 'Invalid blog id' }); // Return error message
          } else {
            // Check if id matched the id of any blog post in the database
            if (!blog) {
              res.json({ success: false, message: 'Blog not found.' }); // Return error message
            } else {
              // Grab data of user that is logged in
              User.findOne({ _id: req.decoded.userId }, (err, user) => {
                // Check if error was found
                if (err) {
                  res.json({ success: false, message: 'Something went wrong' }); // Return error message
                } else {
                  // Check if user was found in the database
                  if (!user) {
                    res.json({ success: false, message: 'User not found.' }); // Return error message
                  } else {
                    // Add the new comment to the blog post's array
                    blog.comments.push({
                      comment: req.body.comment, // Comment field
                      commentator: user.username // Person who commented
                    });
                    // Save blog post
                    blog.save((err) => {
                      // Check if error was found
                      if (err) {
                        res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Comment saved' }); // Return success message
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  });
    return router;
};