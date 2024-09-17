use anchor_lang::prelude::*;

declare_id!("DRUiH1Vd6zUvrZXKmKPwKnYq8jLiUYJdffStA1ETmc2v");

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
