import { InteractionContextType, SlashCommandBuilder } from 'discord.js';
import Command from '../../interfaces/command';
import status from './status';
import emojiMap from '../../utils/emojiMap';
import stats from './stats';

const info: Command = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Information about Quabos and the current guild.')
    .setContexts(InteractionContextType.Guild)
    .addSubcommand(status.data)
    .addSubcommand(stats.data),
  execute: async interaction => {
    if (!interaction.guild) return;

    const subcommand = interaction.options.getSubcommand();
    if (!subcommand) {
      await interaction.reply(
        `${emojiMap.error.cross} Error getting the subcommand.`,
      );
      return;
    }

    switch (subcommand) {
      case 'status':
        await status.execute(interaction);
        break;

      case 'stats':
        await stats.execute(interaction);
        break;

      default:
        await interaction.reply(
          `${emojiMap.error.cross} Error executing or finding the subcommand.`,
        );
        break;
    }
  },
};

export default info;
