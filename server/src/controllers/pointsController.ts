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
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
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

        const pointitem = items.map((item_id: number) => {
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

        return response.json({ point, items });
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

        return response.json(points);
    }
}

export default PointsController;