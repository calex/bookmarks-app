import React, { Component } from  'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config';
import './EditBookmark.css';

const Required = () => (
    <span className='AddBookmark__required'>*</span>
)

export default class EditBookmark extends Component {
    
    state = {
        error: null,

        bookmarkId: this.props.match.params.bookmarkId,

        updatedBookmarkValues: {

            title: '',

            url: '',

            description: '',

            rating: '',
        }
    }

    static contextType = BookmarksContext;

    componentDidMount() {
        fetch(`${config.API_ENDPOINT}/${this.state.bookmarkId}`, {
            method: 'GET'
        })
        .then(res => {
            if (!res.ok) {
              // get the error message from the response,
              return res.json().then(error => {
                // then throw it
                throw error
              })
            }
            return res.json()
        })
        .then(data => {
            this.setState({
                updatedBookmarkValues: data
            })
        })
        .catch(error => {
            console.error(error)
        })
    }

    updateBookmarkTitleInComponentState(typedInTitle) {
        this.setState({
            updatedBookmarkValues: {...this.state.updatedBookmarkValues, title: typedInTitle }
        });
    };

    updateBookmarkUrlInComponentState(typedInUrl) {
        this.setState({
            updatedBookmarkValues: {...this.state.updatedBookmarkValues, url: typedInUrl }
        });
    };

    updateBookmarkDescriptionInComponentState(typedInDescription) {
        this.setState({
            updatedBookmarkValues: {...this.state.updatedBookmarkValues, description: typedInDescription }
        });
    };

    updateBookmarkRatingInComponentState(typedInRating) {
        this.setState({
            updatedBookmarkValues: {...this.state.updatedBookmarkValues, rating: typedInRating }
        });
    };

    handleSubmit = e => {
        e.preventDefault()
        
        this.setState({ error: null })
        
        fetch(`${config.API_ENDPOINT}/${this.state.bookmarkId}`, {
          method: 'PATCH',
          body: JSON.stringify(this.state.updatedBookmarkValues),
          headers: {
            'content-type': 'application/json',
          }
        })
        .then(res => {
          if (!res.ok) {
            return res.body.then(error => Promise.reject(error))
          }
          return res.body
        })
        .then(data => {
            this.context.updateBookmark(this.state.updatedBookmarkValues)
        })
        .then(
            this.props.history.push('/')
        )
        .catch(error => {
          this.setState({ error })
        })
      }

    handleClickCancel = () => {
        this.props.history.push('/')
    };

    render() {
        const { error } = this.state;

        const { title, url, rating, description } = this.state.updatedBookmarkValues;

        return (
        <section className='EditBookmark'>
            <h2>Edit bookmark</h2>
            <form 
                className="EditBookmark__form"
                onSubmit={this.handleSubmit}
            >
                <div className='EditBookmark__error' role='alert'>
                    {error && <p>{error.message}</p>}
                </div>
                <div>
                    <label htmlFor='title'>
                        Title
                        {' '}
                        <Required />
                    </label>
                    <input
                        type='text'
                        name='title'
                        id='title'
                        value={title}
                        onChange={e => this.updateBookmarkTitleInComponentState(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='url'>
                        URL
                        {' '}
                        <Required />
                    </label>
                    <input
                        type='url'
                        name='url'
                        id='url'
                        onChange={e => this.updateBookmarkUrlInComponentState(e.target.value)}
                        value={url}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='description'>
                        Description
                    </label>
                    <textarea
                        value={description}
                        name='description'
                        id='description'
                        onChange={e => this.updateBookmarkDescriptionInComponentState(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='rating'>
                        Rating
                        {' '}
                        <Required />
                    </label>
                    <input
                        type='number'
                        name='rating'
                        id='rating'
                        value={rating}
                        min='1'
                        max='5'
                        onChange={e => this.updateBookmarkRatingInComponentState(e.target.value)}
                        required
                    />
                </div>
                <div className='EditBookmark__buttons'>
                    <button type='button' onClick={this.handleClickCancel}>
                        Cancel
                    </button>
                    {' '}
                    <button type='submit'>
                        Save
                    </button>
                </div>
            </form>
        </section>
    )
  }
}