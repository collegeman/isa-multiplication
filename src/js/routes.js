// containers:
import Full from './containers/Full'
// views:
import Home from './views/Home'

export default [
  {
    path: '/',
    component: Full,
    children: [
      {
        path: '',
        component: Home
      }
    ]
  }
]
