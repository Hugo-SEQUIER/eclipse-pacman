use anchor_lang::prelude::*;

declare_id!("DjUfeeJXsQHPd811GHmhB6zVraAyBBVzv365BA8Ruf8T");

#[program]
pub mod pacman_game {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
