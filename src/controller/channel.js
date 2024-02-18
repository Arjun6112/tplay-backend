import { Queries } from "../database/queries.js";

export async function createNewChannel(req, res) {
  const { name } = req.body;
  const { email } = req.user;

  const existingUser = await Queries.doesEmailAlreadyExists(email);
  if (!existingUser) {
    return res.sendStatus(404).json({
      message: "User does not exists in our system."
    });
  }

  const owner = await Queries.findUserWithEmail(email);
  if (!owner || owner == undefined) {
    return res.send(500);
  }

  const channel = await Queries.createNewChannel(name, owner);

  res.sendStatus(201).json({
    id: channel.id,
    name: channel.name,
    owner: owner.name
  });
}
