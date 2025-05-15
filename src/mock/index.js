import Mock from 'mockjs'

const Random = Mock.Random

// 生成模拟数据
function generateMockItems(count = 10) {
  const items = []
  for (let i = 0; i < count; i++) {
    const isVideo = Random.boolean()
    items.push({
      id: Random.id(),
      title: Random.ctitle(5, 15),
      content: Random.cparagraph(1, 3),
      type: isVideo ? 'video' : 'image',
      // media: isVideo ? Random.video() : Random.image('640x360'),
      likes: Random.natural(0, 10000),
      comments: Random.natural(0, 5000),
      shares: Random.natural(0, 2000),
      user: {
        avatar: Random.image('50x50'),
        name: Random.cname(),
        verified: Random.boolean()
      },
      timestamp: Random.now('yyyy-MM-dd HH:mm:ss')
    })
  }
  return items
}

Mock.mock('/api/community/list', 'post', function(options) {
  const { page = 1, size = 10, type = 'all' } = options.params || {}

  // 模拟不同数据格式
  let items = []
  if (type === 'all') {
    items = generateMockItems(size)
  } else if (type === 'video') {
    items = generateMockItems(size).filter(item => item.type === 'video')
  } else if (type === 'image') {
    items = generateMockItems(size).filter(item => item.type === 'image')
  } else if (type === 'hot') {
    items = generateMockItems(size).sort(() => 0.5 - Math.random())
  }

  return {
    code: 200,
    data: {
      list: items,
      page,
      size,
      total: 1000,
      hasMore: page < 10
    }
  }
})

Mock.mock('/api/community/hot', 'get', function() {
  return {
    code: 200,
    data: generateMockItems(5)
  }
})

