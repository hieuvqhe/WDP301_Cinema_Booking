import { ObjectId } from 'mongodb'

interface FavoriteType {
  _id?: ObjectId
  user_id: ObjectId
  movie_id: ObjectId
  created_at?: Date
  updated_at?: Date
}

export default class Favorite {
  _id?: ObjectId
  user_id: ObjectId
  movie_id: ObjectId
  created_at: Date
  updated_at: Date

  constructor({ _id, user_id, movie_id, created_at, updated_at }: FavoriteType) {
    const date = new Date()
    this._id = _id
    this.user_id = user_id
    this.movie_id = movie_id
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
