import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'

const PhotoImages = ({photos}) => {
  return (
    photos.map((photo) => (
      <div
        className="album-image margin-top-0"
        style={{
          backgroundImage: `url(${photo.node.secure_url})`,
          width: '100%',
          paddingTop: `${100 * photo.node.height / photo.node.width}%`, // container-width * height / width
          marginBottom: `4%`,
        }}
      ></div>
    ))
  )
}

export const IndexPageTemplate = ({
  image,
  title,
  subheading,
  photos
}) => (
  <div>
    <div
      className="full-width-image margin-top-0"
      style={{
        backgroundImage: `url(${
          // !!image.childImageSharp ? image.childImageSharp.fluid.src : 
          image.secure_url
        })`,
        paddingTop: `${50 * image.height / image.width}%`,
        paddingBottom: `${50 * image.height / image.width}%`,
        // backgroundPosition: `top left`,
        backgroundAttachment: `fixed`,
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '150px',
          lineHeight: '1',
          justifyContent: 'space-around',
          alignItems: 'left',
          flexDirection: 'column',
        }}
      >
        <h1
          className="has-text-weight-bold is-size-3-mobile is-size-2-tablet is-size-1-widescreen"
          style={{
            boxShadow:
              'rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px',
            backgroundColor: 'rgb(255, 68, 0)',
            color: 'white',
            lineHeight: '1',
            padding: '0.25em',
          }}
        >
          {title}
        </h1>
        <h3
          className="has-text-weight-bold is-size-5-mobile is-size-5-tablet is-size-4-widescreen"
          style={{
            boxShadow:
              'rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px',
            backgroundColor: 'rgb(255, 68, 0)',
            color: 'white',
            lineHeight: '1',
            padding: '0.25em',
          }}
        >
          {subheading}
        </h3>
      </div>
    </div>
    <section className="section section--gradient">
      <div className="container">
        <div className="columns">
          <div className="column is-10 is-offset-1">
          {photos ?
            <PhotoImages photos={photos} />
            :
            null
          }
          </div>
        </div>
      </div>
    </section>
  </div>
)

IndexPageTemplate.propTypes = {
  // image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  image: PropTypes.object,
  title: PropTypes.string,
  heading: PropTypes.string,
  subheading: PropTypes.string,
  photos: PropTypes.array,
}

const IndexPage = ({ data }) => {
  const { markdownRemark: {frontmatter}, cloudinaryMedia, allCloudinaryMedia: {edges: photos} } = data

  return (
    <Layout>
      <IndexPageTemplate
        image={cloudinaryMedia}
        title={frontmatter.title}
        heading={frontmatter.heading}
        subheading={frontmatter.subheading}
        photos={photos}
      />
    </Layout>
  )
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
      cloudinaryMedia: PropTypes.object,
      photos: PropTypes.array,
    }),
  }),
}

export default IndexPage

export const pageQuery = graphql`
  query IndexPageTemplate( $image_publicid: String ) {
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        title
        image
        subheading
      }
    }
    allCloudinaryMedia (sort: {fields: id}) { 
      edges {
        node {
          secure_url
          width
          height
        }
      }
    }
    cloudinaryMedia(public_id: { eq: $image_publicid } ) {
      secure_url
      width
      height
    }
  }
`
