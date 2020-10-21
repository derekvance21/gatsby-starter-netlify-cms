import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import { Helmet } from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'

const AlbumImages = ({photos}) => {
  return (
    photos.map((url) => (
      <div
        className="album-image margin-top-0"
        style={{
          backgroundImage: `url(${url})`,
          // backgroundAttachment: `fixed`, // this would make a 'parallax' effect where the image doesn't scroll w the page
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
            <AlbumImages
              photos={photos}
            />
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
  const { markdownRemark: album } = data

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
        photos={album.frontmatter.photos}
      />
    </Layout>
  )
}

AlbumPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default AlbumPost

export const pageQuery = graphql`
  query AlbumPostByID($id: String!) {
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
  }
`
