const collision = require('.')
const { mat2d } = require('gl-matrix')

const target = collision.create([[0, 5], [-2, 0], [0, -5], [2, 0]])

console.log(target)

const near = collision.create([[1, 3], [1, -3], [4, -3], [4, 3]])
const far = collision.create([[3, 3], [3, -3], [6, -3], [6, 3]])

const nearTarget = collision.transform(target, mat2d.fromTranslation([], [-1, -5]))
const farTarget = collision.transform(target, mat2d.fromTranslation([], [3, 4]))

// simple bounding box detection should work for these
console.log(collision.check(target, near))
console.log(collision.check(target, far))

// while these need the entire edge detection stuff
console.log(collision.check(target, nearTarget))
console.log(collision.check(target, farTarget))
