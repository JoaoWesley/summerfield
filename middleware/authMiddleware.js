export default function ({ app, req, res, redirect }) {
  if (!app.$cookiz.get('token')) {
    return redirect('/')
  }
}
