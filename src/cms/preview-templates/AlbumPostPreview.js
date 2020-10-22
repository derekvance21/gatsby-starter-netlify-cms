import React from 'react'
import PropTypes from 'prop-types'
import { AlbumPostTemplate } from '../../templates/album-post'

// how to create custom previews
// https://www.netlifycms.org/docs/customization/

const AlbumPostPreview = ({ entry }) => {

  const data = entry.getIn(['data']).toJS();
  const {description, tags, title, photos} = data;
  
  return (
    <AlbumPostTemplate
      description={description}
      tags={tags}
      title={title}
      photos={photos}
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
