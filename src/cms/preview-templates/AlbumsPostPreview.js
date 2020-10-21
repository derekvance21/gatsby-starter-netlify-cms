import React from 'react'
import PropTypes from 'prop-types'
import { AlbumPostTemplate } from '../../templates/album-post'

const AlbumPostPreview = ({ entry, widgetFor }) => {
  const tags = entry.getIn(['data', 'tags'])
  return (
    <AlbumPostTemplate
      description={entry.getIn(['data', 'description'])}
      tags={tags && tags.toJS()}
      title={entry.getIn(['data', 'title'])}
      photos={entry.getIn(['data', 'photos'])}
    />
  )
}

AlbumPostPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default AlbumPostPreview
