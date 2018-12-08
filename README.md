Polygon-to-polygon collision calculator for Deltasnare's physics engine

# Usage

```javascript
const collision = require('@deltasnare/physics2d-collision')
const { mat2d } = require('gl-matrix')

// create some collider models
const target = collision.create([[0, 5], [-2, 0], [0, -5], [2, 0]])
const near = collision.create([[1, 3], [1, -3], [4, -3], [4, 3]])
const far = collision.create([[3, 3], [3, -3], [6, -3], [6, 3]])

// transform models
const transformed = collision.transform(target, mat2d.fromTranslation([], [-1, -5]))

// test for collisions
const nearCollision = collision.check(target, near) // { depth: 1, normal: [1, 0] }
const farCollision = collision.check(target, far) // null
```

The collision module exports three functions:

## `collision.create(vertices)`

Creates a collider model. The argument is an array of vertices in `vec2` format (`[x, y]`). **The vertices must define a convex mesh in counter-clockwise order. Failing to comply with this assumption may lead to undefiend behavior and/or the physics engine blowing up.** For the structure of the returned collider model, [see below](#collision-models).

## `collision.transform(model, transform)`

Transforms a collider model with a 2D matrix, returning the resulting model. The `model` argument must be a collider model created by `collision.create()` or compatible with it, and `transform` is a `mat2d`, a 3x2 2D transformation matrix.

## `collision.check(first, second)`

Checks if two models collide. Both arguments must be collider models created by `collision.create()` or compatible with it. Returns `null` if the objects do not collide. If they do, it returns a collision in the following format:

```javascript
{ depth: 1, normal: [1, 0] }
```

Where
 - `depth` is the penetration depth (how far the objects overlap)
 - `normal` is the collision normal, the direction of the penetration. This vector is normalized.

# Collider Models

Collider models are the basic models that can be collided with this module. Here is an example:

```javascript
{ vertices: [ [ 0, 5 ], [ -2, 0 ], [ 0, -5 ], [ 2, 0 ] ],
  normals:
   [ [ -0.9284766908852593, 0.3713906763541037 ],
     [ -0.9284766908852593, -0.3713906763541037 ],
     [ 0.9284766908852593, -0.3713906763541037 ],
     [ 0.9284766908852593, 0.3713906763541037 ] ],
  boundingBox: { min: [ -2, -5 ], max: [ 2, 5 ] } }
```

Collider models are objects, with the following layout:
 - `vertices` is an array of `vec2` which define a convex polygon in counter-clockwise order
 - `normals` is an array of `vec2` where each member `normals[i]` corresponds to the outer normal of the edge between `vertices[i]` and `vertices[i + 1]`
 - `boundingBox` defines an axis-aligned bounding box of the mesh using an object, where:
   - `min` is a `vec2`, containing the lowest coordinates of the box in each axis, and
   - `max` is a `vec2`, containing the highest coordinates of the box in each axis
