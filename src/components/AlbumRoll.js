import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import PreviewCompatibleImage from './PreviewCompatibleImage'

export default function AlbumRoll() {
  const {allMarkdownRemark: {edges: albums}} = useStaticQuery(graphql`
    query AlbumRollQuery {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: { frontmatter: { templateKey: { eq: "album-post" } } }
      ) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              title
              templateKey
              date(formatString: "MMMM DD, YYYY")
              featuredimage
              description
            }
          }
        }
      }
    }
  `)

  return (
    <div className="columns is-multiline">
      {albums &&
        albums.map(({ node: album }) => (
          <div className="is-parent column is-6" key={album.id}>
            <article
              className={`blog-list-item tile is-child box notification`}
            >
              <header>
                {album.frontmatter.featuredimage ? (
                  <div className="featured-thumbnail">
                    <PreviewCompatibleImage
                      imageInfo={{
                        image: album.frontmatter.featuredimage[0],
                        alt: `featured image thumbnail for album ${album.frontmatter.title}`,
                      }}
                    />
                  </div>
                ) : null}
                <p className="post-meta">
                  <Link
                    className="title has-text-primary is-size-4"
                    to={album.fields.slug}
                  >
                    {album.frontmatter.title}
                  </Link>
                  <span> &bull; </span>
                  <span className="subtitle is-size-5 is-block">
                    {album.frontmatter.date}
                  </span>
                </p>
              </header>
              <p>
                {album.frontmatter.description}
                <br />
                <br />
                <Link className="button" to={album.fields.slug}>
                  Keep Reading →
                </Link>
              </p>
            </article>
          </div>
      ))}
    </div>
  )
}