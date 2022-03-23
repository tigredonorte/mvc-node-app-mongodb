import { Request, Response } from 'express';

import { UsersModel } from './user.model';

const model = new UsersModel();
const views = 'modules/user/user/views';

export class UserController {
  async list(req: Request<any>, res: Response<any>) {
    const userList = await model.list();
    res.render(`${views}/index`, {
      docTitle: 'User List',
      pageName: req.originalUrl,
      userList,
      isEmpty: userList.length === 0,
    });
  }

  async show(req: Request<any>, res: Response<any>) {
    const user = await model.get(req.params.id);
    if (!user) {
      return res.render('modules/index/views/404', {
        docTitle: 'User not found',
        docContent: `The User that your looking for doesn't exists`, // eslint-disable-line
      });
    }
    res.render(`${views}/show`, {
      docTitle: user.name,
      pageName: req.originalUrl,
      user,
    });
  }

  add(req: Request<any>, res: Response<any>) {
    res.render(`${views}/add`, {
      docTitle: 'Add User',
      pageName: req.originalUrl,
      product: {},
    });
  }

  async addPost(req: Request<any>, res: Response<any>) {
    try {
      await model.add(req.body);
      res.redirect('/user');
    } catch (error) {
      res.status(500);
      res.render(`${views}/add`, {
        error,
        docTitle: 'Add User',
        pageName: req.originalUrl,
        product: {},
      });
    }
  }

  async edit(req: Request<any>, res: Response<any>) {
    const user = await model.get(req.params.id);
    if (!user) {
      res.redirect('/');
    }
    res.render(`${views}/add`, {
      docTitle: 'Edit User',
      pageName: req.originalUrl,
      user,
    });
  }

  async editPatch(req: Request<any>, res: Response<any>) {
    try {
      await model.edit(req.params.id, req.body)
      res.redirect(`/user/show/${req.params.id}`);
    } catch (error) {
      res.status(500);
      res.render(`${views}/add`, {
        error,
        docTitle: 'Add User',
        pageName: req.originalUrl,
        product: {},
      });
    }
  }

  async delete(req: Request<any>, res: Response<any>) {
    try {
      await model.delete(req.params.id);
      res.redirect('/user');
    } catch (error) {
      res.status(500);
      res.render(`${views}/add`, {
        error,
        docTitle: 'Add User',
        pageName: req.originalUrl,
        product: {},
      });
    }
  }
}
