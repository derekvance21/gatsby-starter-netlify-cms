import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import { Helmet } from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'

const AlbumImages = ({photos}) => {
  return (
    photos.map((photo) => (
      <div
        className="album-image margin-top-0"
        style={{
          backgroundImage: `url(${photo.node.secure_url})`,
          width: '100%',
          paddingTop: `${100 * photo.node.height / photo.node.width}%` // container-width * height / width
        }}
      ></div>
    ))
  )
}

export const AlbumPostTemplate = ({
  description,
  photos,
  title,
  helmet,
  tags
}) => {

  return (
    <section className="section">
      {helmet || ''}
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              {title}
            </h1>
            <p>{description}</p>
            {photos ? 
              <AlbumImages
                photos={photos}
              />
              :
              null
            }
            {tags && tags.length ? (
              <div style={{ marginTop: `4rem` }}>
                <h4>Tags</h4>
                <ul className="taglist">
                  {tags.map((tag) => (
                    <li key={tag + `tag`}>
                      <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

AlbumPostTemplate.propTypes = {
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
  photos: PropTypes.array,
}

const AlbumPost = ({ data }) => {
  const { 
    markdownRemark: album, 
    allCloudinaryMedia: {
      edges: photos
    } 
  } = data


  return (
    <Layout>
      <AlbumPostTemplate
        description={album.frontmatter.description}
        helmet={
          <Helmet titleTemplate="%s | Album">
            <title>{`${album.frontmatter.title}`}</title>
            <meta
              name="description"
              content={`${album.frontmatter.description}`}
            />
          </Helmet>
        }
        // tags={album.frontmatter.tags}
        title={album.frontmatter.title}
        photos={photos}
      />
    </Layout>
  )
}

AlbumPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
    allCloudinaryMedia: PropTypes.object,
  }),
}

export default AlbumPost

export const pageQuery = graphql`
  query AlbumPostByID($id: String!, $photos_publicid: [String]) {
    markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
        photos
      }
    }
    allCloudinaryMedia(filter: {public_id: { in: $photos_publicid }}) {
      edges {
        node {
          height
          width
          secure_url
        }
      }
    }
  }
`
