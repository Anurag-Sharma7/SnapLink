
import express from 'express';
import Url from '../Url.js';
import { nanoid } from 'nanoid';

const router = express.Router();

router.post('/shorten', async (req, res) => {
    try {
        const { originalUrl } = req.body;
        //const shortId = nanoid(8);

        if (!originalUrl) {
            return res.status(400).json({ error: 'Original URL is required' });
        }
        try {
            new URL(originalUrl);
        } catch (err) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        let shortId;
        let exists = true;

        while (exists) {
            shortId = nanoid(7);
            exists = await Url.findOne({ shortId });
        }

        const url = await Url.create({ shortId, originalUrl });

        res.json({
            shortId: url.shortId,
            shortUrl: `${process.env.BASE_URL}/${url.shortId}`,
        })
    }
    catch (err) {
        console.error('Error shortening URL:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/analytics/:shortId', async (req, res) => {
    try {
        const { shortId } = req.params;
        const url = await Url.findOne({ shortId });
        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }
        res.json({
            originalUrl: url.originalUrl,
            shortId: url.shortId,
            clicks: url.clicks,
        });
    } catch (err) {
        console.error('Error fetching analytics:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:shortId', async (req, res) => {
    try {
        const { shortId } = req.params;
        const url = await Url.findOne({ shortId });
        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }
        url.clicks += 1;
        await url.save();

        return res.redirect(url.originalUrl);
    } catch (err) {
        console.error('Error redirecting URL:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;


