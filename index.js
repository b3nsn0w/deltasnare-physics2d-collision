const { vec2 } = require('gl-matrix')

// calculate edge normals, n[i] corresponds to edge between v[i] and v[i + 1]
const calculateNormals = (vertices) => {
  return vertices.map((current, index) => {
    const next = vertices[(index + 1) % vertices.length]
    const edge = vec2.subtract([], next, current)
    return vec2.normalize([], [edge[1], -edge[0]])
  })
}

const calculateBoundingBox = (vertices) => {
  const boundingBox = {
    min: [...vertices[0]],
    max: [...vertices[0]]
  }

  vertices.slice(1).map(vertex => {
    boundingBox.min[0] = Math.min(boundingBox.min[0], vertex[0])
    boundingBox.min[1] = Math.min(boundingBox.min[1], vertex[1])
    boundingBox.max[0] = Math.max(boundingBox.max[0], vertex[0])
    boundingBox.max[1] = Math.max(boundingBox.max[1], vertex[1])
  })

  return boundingBox
}

const createColliderModel = (vertices) => {
  const normals = calculateNormals(vertices)
  const boundingBox = calculateBoundingBox(vertices)

  return { vertices, normals, boundingBox }
}

const transformModel = (model, transform) => {
  const vertices = model.vertices.map(vertex => vec2.transformMat2d([], vertex, transform))
  const normals = calculateNormals(vertices)
  const boundingBox = calculateBoundingBox(vertices)

  return { vertices, normals, boundingBox }
}

const checkVertex = (vertex, normal, object) => {
  let depth = 0

  for (const target of object.vertices) {
    const relative = vec2.subtract([], target, vertex)
    const projected = vec2.dot(normal, relative)
    if (projected < 0) depth = Math.max(depth, -projected) // negative sign means the target vertex is on the inside
  }

  return depth
}

const checkCollision = (first, second) => {
  if (first.boundingBox.max[0] < second.boundingBox.min[0]) return null
  if (second.boundingBox.max[0] < first.boundingBox.min[0]) return null
  if (first.boundingBox.max[1] < second.boundingBox.min[1]) return null
  if (second.boundingBox.max[1] < first.boundingBox.min[1]) return null

  let firstParams = { depth: Infinity, normal: null }
  for (let i = 0; i < first.vertices.length; i++) {
    const depth = checkVertex(first.vertices[i], first.normals[i], second)
    if (!depth) return null
    if (depth < firstParams.depth) firstParams = { depth, normal: first.normals[i] }
  }

  let secondParams = { depth: Infinity, normal: null }
  for (let i = 0; i < second.vertices.length; i++) {
    const depth = checkVertex(second.vertices[i], second.normals[i], first)
    if (!depth) return null
    if (depth < secondParams.depth) secondParams = { depth, normal: second.normals[i] }
  }

  if (firstParams.depth < secondParams.depth) {
    return { depth: firstParams.depth, normal: vec2.scale([], firstParams.normal, 1) }
  } else {
    return { depth: secondParams.depth, normal: vec2.scale([], secondParams.normal, -1) }
  }
}

module.exports = {
  create: createColliderModel,
  transform: transformModel,
  check: checkCollision
}
