const xlsx = require('xlsx');
const fs = require('fs');
const Upload = require('../models/Upload');

exports.uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = xlsx.utils.sheet_to_json(worksheet, { defval: null });
    const columns = json.length > 0 ? Object.keys(json[0]) : [];
    const upload = new Upload({
      user: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      columns,
      data: json,
    });
    await upload.save();
    try { fs.unlinkSync(req.file.path); } catch (e) { }
    res.json({ message: 'File parsed and saved', uploadId: upload._id, columns });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to parse file' });
  }
};

exports.getUploadsForUser = async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUploadById = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ message: 'Upload not found' });
    if (upload.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(upload);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getChartData = async (req, res) => {
  try {
    const { uploadId } = req.params;
    const { xAxis, yAxis } = req.query;
    const upload = await Upload.findById(uploadId);
    if (!upload) return res.status(404).json({ message: 'Upload not found' });
    const rows = upload.data;
    const x = [];
    const y = [];
    for (let r of rows) {
      if (typeof r[xAxis] === 'undefined' || typeof r[yAxis] === 'undefined') continue;
      x.push(r[xAxis]);
      y.push(Number(r[yAxis]) || 0);
    }
    res.json({ x, y });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
