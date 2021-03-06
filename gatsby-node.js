const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')
const { siteMetadata } = require('./gatsby-config.js')
const { forEach } = require('lodash')
const { node } = require('prop-types')

function getPublicIdFromURL(url, cloudinaryFolder) {
  if (typeof url !== "string") {
    console.log(`ERROR: ${url} is a ${typeof url}, not a string`);
    return null
  }
  const cloudinaryFolderIndex = url.indexOf(cloudinaryFolder)
  const extensionRegex = /\.(?:jpg|jpeg|webp|gif|png|bmp|tiff|svg)$/gmi
  const imageExtensionIndex = url.search(extensionRegex)
  return url.slice(cloudinaryFolderIndex, imageExtensionIndex)
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
    let image_publicid = null
    const cloudinaryFolder = siteMetadata.cloudinary_folder
    if (node.frontmatter.templateKey === `album-post`) {
      featuredimage_publicid = getPublicIdFromURL(node.frontmatter.featuredimage[0], cloudinaryFolder)
      photos_publicids = node.frontmatter.photos.map(photo => getPublicIdFromURL(photo, cloudinaryFolder))
    }
    if (node.frontmatter.templateKey === `index-page`) {
      image_publicid = getPublicIdFromURL(node.frontmatter.image, cloudinaryFolder)
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
    createNodeField({
      name: `image_publicid`,
      node,
      value: image_publicid,
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
      image_publicid: String
    }
    type Frontmatter {
      featuredimage: [String]
      image: String
      photos: [String]
    }
  `
  createTypes(typeDefs)
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
              photos_publicids
              image_publicid
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
      createPage({
        path: edge.node.fields.slug,
        tags: edge.node.frontmatter.tags,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
        ),
        context: {
          id: edge.node.id,
          photos_publicids: edge.node.fields.photos_publicids,
          image_publicid: edge.node.fields.image_publicid,
        },
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
