import knex from '../database/connection';
import { Request, Response, request } from 'express';

class PointsController {
    async create(request: Request, response: Response) {
        const {
            nome,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            nome,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        const insertedId = await trx('point').insert(point);

        const point_id = insertedId[0];

        const pointitem = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id: point_id
                };
            });

        await trx('point_items').insert(pointitem);

        await trx.commit();

        return response.json({
            id: point_id,
            ...point
        });
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('point').where('id', id).first();

        if (!point)
            return response.status(400).json({ message: 'Point not found' });

        const items = await knex('item')
            .join('point_items', 'item.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('item.id', 'item.title');

        const serializedPoints = {
            ...point,
            image_url: `http://192.168.0.19:3333/uploads/${point.image}`
        };

        return response.json({ serializedPoints, items });
    }

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex('point')
            .join('point_items', 'point.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('point.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.0.19:3333/uploads/${point.image}`
            }
        })

        return response.json(serializedPoints);
    }
}

export default PointsController;