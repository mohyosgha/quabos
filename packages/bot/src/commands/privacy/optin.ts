import { SlashCommandSubcommandBuilder } from 'discord.js';
import Subcommand from '../../interfaces/subcommand';
import { prisma } from '../..';
import emojiMap from '../../utils/emojiMap';

const optin: Subcommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('opt-in')
    .setDescription('Opt-in to message collection for the model.')
    .addStringOption(scope =>
      scope
        .setName('scope')
        .setDescription(
          'Opt-in either only in this server, or globally (in every server that both you and Quabos are in).',
        )
        .addChoices({ name: 'server', value: 'server' }, { name: 'global', value: 'global' })
        .setRequired(true),
    ),
  usage: '/privacy opt-in [scope]',
  execute: async interaction => {
    if (!interaction.guild) return;

    const scope = interaction.options.getString('scope', true);
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    if (scope === 'global') {
      const user = await prisma.user.findUnique({
        where: { userId },
      });

      if (!user) {
        await interaction.reply(
          `${emojiMap.success.check} You are already opted-in globally!`,
        );
        return;
      }

      if (user.ignored) {
        await prisma.user.update({
          where: { userId },
          data: { ignored: false },
        });
        await interaction.reply(
          `${emojiMap.success.check} You have successfully opted-in globally!`,
        );
      } else {
        await interaction.reply(`${emojiMap.error.cross} You are already opted-in globally!`);
      }
      return;
    }

    if (scope === 'server') {
      const guildMember = await prisma.guildMember.findUnique({
        where: { userId_guildId: { userId, guildId } },
      });

      if (!guildMember) {
        await interaction.reply(
          `${emojiMap.success.check} You are already opted-in for this server!`,
        );
        return;
      }

      if (guildMember.ignored) {
        await prisma.guildMember.update({
          where: { userId_guildId: { userId, guildId } },
          data: { ignored: false },
        });
        await interaction.reply(
          `${emojiMap.success.check} You have successfully opted-in for this server!`,
        );
      } else {
        await interaction.reply(
          `${emojiMap.error.cross} You are already opted-in for this server!`,
        );
      }
    }
  },
};

export default optin;
