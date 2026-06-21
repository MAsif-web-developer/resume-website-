export default (req, res) => {
  // Simple health check – returns status 200 and JSON payload
  res.status(200).json({ ok: true, message: "Vercel API is alive" });
};
