import Knex from 'knex';

export async function seed(knex: Knex) {
    await knex('item').insert([
        { title: 'Lámpadas', image: 'lampadas.svg' },
        { title: 'Pilhas e Baterias', image: 'baterias.svg' },
        { title: 'Papéis e Papelão', image: 'papeis-papelão.svg' },
        { title: 'Resíduos Eletrônicos', image: 'eletronicos.svg' },
        { title: 'Resíduos Orgânicos', image: 'orgânicos.svg' },
        { title: 'Óleo de Cozinha', image: 'oelo.svg' }
    ]);
}