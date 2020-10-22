const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')
const { siteMetadata } = require('./gatsby-config.js')
const { forEach } = require('lodash')
const { node } = require('prop-types')

function getPublicIdFromURL(url, cloudinaryFolder) {
  const cloudinaryFolderIndex = url.indexOf(cloudinaryFolder)
  const extensionRegex = /\.(?:jpg|jpeg|webp|gif|png|bmp|tiff|svg)$/gmi
  const imageExtensionIndex = url.search(extensionRegex)
  return url.slice(cloudinaryFolderIndex, imageExtensionIndex)
}

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {

      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              tags
              templateKey
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    posts.forEach((edge) => {
      const id = edge.node.id
      let albumPostFields = {}
      if (edge.node.frontmatter.templateKey === 'album-post') {
        albumPostFields = {
          featuredimage_publicid: edge.node.fields.featuredimage_publicid,
          photos_publicids: edge.node.fields.photos_publicids
        }
      }
      const context = {
        id,
        ...albumPostFields
      }
      // create if structure for templateKey - or do it down in context with a ? : thing (maybe)
      createPage({
        path: edge.node.fields.slug,
        tags: edge.node.frontmatter.tags,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
        ),
        // additional data can be passed via context
        // pass more here! For album-post you need lots of photos, pass their public id's!
        context: context,
      })
    })

    // Tag pages:
    let tags = []
    // Iterate through each post, putting all found tags into `tags`
    posts.forEach((edge) => {
      if (_.get(edge, `node.frontmatter.tags`)) {
        tags = tags.concat(edge.node.frontmatter.tags)
      }
    })
    // Eliminate duplicate tags
    tags = _.uniq(tags)

    // Make tag pages
    tags.forEach((tag) => {
      const tagPath = `/tags/${_.kebabCase(tag)}/`

      createPage({
        path: tagPath,
        component: path.resolve(`src/templates/tags.js`),
        context: {
          tag,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value: slug,
    })
    let featuredimage_publicid = null
    let photos_publicids = null
    if (node.frontmatter.templateKey === `album-post`) {
      const cloudinaryFolder = siteMetadata.cloudinary_folder
      featuredimage_publicid = getPublicIdFromURL(node.frontmatter.featuredimage, cloudinaryFolder)
      photos_publicids = node.frontmatter.photos.map(photo => getPublicIdFromURL(photo, cloudinaryFolder))
    }
    createNodeField({
      name: `featuredimage_publicid`,
      node,
      value: featuredimage_publicid, // THIS HAS TO BE CALLED VALUE BECAUSE IT GETS DESTRUCTURED AS SUCH!
    })
    createNodeField({
      name: `photos_publicids`,
      node,
      value: photos_publicids, // THIS HAS TO BE CALLED VALUE BECAUSE IT GETS DESTRUCTURED AS SUCH!
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MarkdownRemark implements Node {
      fields: Fields
      frontmatter: Frontmatter
    }
    type Fields {
      slug: String!
      featuredimage_publicid: String
      photos_publicids: [String]
    }
    type Frontmatter {
      featuredimage: String
      image: String
      photos: [String]
    }
  `
  createTypes(typeDefs)
}
