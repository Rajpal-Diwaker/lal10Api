let Category = require('../../models/category')

const addCategory = async (criteria, cb) => {
    let { categoryHiearchy } = criteria

    try {
        for (const key in categoryHiearchy) {
            const title = categoryHiearchy[key];
            await Category.query()
            .insert({ tilte }); 
        }
                     
        cb(null, 'Success')
    } catch (e) {
       msg = "Some error in db query in add categiry"
    //    console.log(msg, e)
       cb(msg, null)
    }
}

const viewCategory = async (criteria, cb) => {
    try {
        const categories = await Category.query()
        .join('category as cp', 'cp.id', 'c.parentId')
        .select('cp.id', 'c.title', 'cp.title as parentTitle')
                     
        cb(null, categories.result)
    } catch (e) {
       msg = "Some error in db query in view categiry"
    //    console.log(msg, e)
       cb(msg, null)
    }
}

module.exports = {
    addCategory,
    viewCategory
}