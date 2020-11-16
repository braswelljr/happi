const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Handle products get requests'
  })
})

router.post('/', (req, res) => {
  res.status(200).json({
    message: 'Handle products post requests'
  })
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  if (id === 'special') {
    res.status(200).json({
      message: 'An id was passed',
      id: id
    })
  }else{
    res.status(200).json({
      message: 'An id was passed'
    })
  }
})

router.patch('/:id', (req, res) => {
  res.status(200).json({
    message: 'Product updated successfully'
  })
})

router.delete('/:id', (req, res) => {
  res.status(200).json({
    message: 'Product deleted successfully'
  })
})

module.exports = router